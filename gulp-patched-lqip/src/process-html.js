'use strict'

const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const pretty = require('pretty')
const { processImage, supportedMimetypes } = require('./process-image')

const validImgExtensions = Object.keys(supportedMimetypes).map(ext => `.${ext}`)

const ESCAPE_TABLE = {
  '#': '%23',
  '%': '%25',
  ':': '%3A',
  '<': '%3C',
  '>': '%3E',
  '"': "'",
};
const ESCAPE_REGEX = new RegExp(Object.keys(ESCAPE_TABLE).join('|'), 'g');
function escaper(match) {
  return ESCAPE_TABLE[match];
}

function composeSvg(origImg, base64, originalUrl) {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 ${origImg.bitmap.width} ${origImg.bitmap.height}">
    <filter id="b" color-interpolation-filters="sRGB">
    <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
    <feComponentTransfer>
        <feFuncA type="discrete" tableValues="1 1"></feFuncA>
    </feComponentTransfer>
    </filter>
    <image filter="url(#b)" preserveAspectRatio="none"
    height="100%" width="100%"
    xlink:href="${base64}">
    </image>
</svg>`;
  svg = svg.replace(/\s+/g, ' ');
  svg = svg.replace(/> </g, '><');
  svg = svg.replace(ESCAPE_REGEX, escaper);
  return svg;
}

const processHtml = (file, config) => new Promise((resolve, reject) => {
  const { rootPath, attribute, srcAttr, pretty: prettyHtml } = config
  const fileContent = file.contents.toString('utf8')
  const $ = cheerio.load(fileContent)
  const imageList = $('img').toArray()

  const promiseList = imageList.filter(el => {
    const jqEl = $(el);
    const src = jqEl.attr(srcAttr);

    // @todo: handle remote images later
    // TODO: Check for class also
    if (!src || src.startsWith('http') || src.startsWith('//')) {
      return false
    }

    const classNameMatched = jqEl.hasClass('lazy-load');

    if (!classNameMatched) {
      return false;
    }

    const pathImg = path.join(rootPath, src)

    return validImgExtensions.includes(path.extname(pathImg).toLowerCase())
  })
    .map(el => {
      const src = $(el).attr(srcAttr)
      const pathImg = path.join(rootPath, src)

      return processImage(pathImg, src)
    })

  Promise.all(promiseList)
    .then(resultList => {
      resultList.forEach(({
        // extension,
        origImage,
        // pathImg,
        originalImg,
        base64,
      }) => {
        const image = imageList.find(el => $(el).attr(srcAttr) === originalImg && !$(el).attr(attribute))

        try {
        const jqImage = $(image);
        const svg = composeSvg(origImage, base64, originalImg);
        const URI = `data:image/svg+xml;charset=utf-8,${svg}`;
        /* // DEBUG
         * const srcAttrValue = jqImage.attr(srcAttr);
         * const attrValue = jqImage.attr(attribute);
         * console.log('XXX', {
         *   URI,
         *   svg,
         *   srcAttrValue,
         *   attrValue,
         *   jqImage,
         *   image,
         *   attribute,
         *   srcAttr,
         *   // extension,
         *   origImage,
         *   // pathImg,
         *   originalImg,
         *   base64,
         * });
         */
        jqImage.attr('loading', 'lazy');
        jqImage.attr('width', origImage.bitmap.width);
        jqImage.attr('height', origImage.bitmap.height);
        // jqImage.attr(srcAttr, base64);
        // jqImage.attr(attribute, srcAttrValue);
        jqImage.css('background-size', 'cover');
        jqImage.css('background-image', `url("${URI}")`);
        } catch(error) {
          console.error('[processHtml]', error, {
            error,
            image,
            origImage,
            // pathImg,
            originalImg,
            base64,
          });
          debugger;
        }
      })

      const data = prettyHtml ?
        pretty($.html(), { ocd: true }) :
        $.html()

      fs.writeFile(file.path, data, err => {
        if (err) {
          throw err
        }

        resolve()
      })
    })
    .catch(error => reject(error))
})

module.exports = {
  processHtml
}
