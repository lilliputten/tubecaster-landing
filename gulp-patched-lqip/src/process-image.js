'use strict'

const path = require('path')
const jimp = require('jimp')

const supportedMimetypes = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif'
}

const toBase64 = (extMimeType, data) => `data:${extMimeType};base64,${data.toString('base64')}`

const processImage = (pathImg, originalImg) => new Promise((resolve, reject) => {
  const extension = path.extname(pathImg)
    .split('.')
    .pop()

  jimp.read(pathImg)
    .then(origImage => {
      const resized = origImage.clone().resize(10, jimp.AUTO);
      const promise = resized.getBufferAsync(supportedMimetypes[extension]);
      return promise.then((data) => {
        const base64 = toBase64(supportedMimetypes[extension], data);
        return resolve({
          origImage,
          extension,
          pathImg,
          originalImg,
          base64
        });
      }).catch(reject);
    }).catch(reject);
    // .catch(error => {
    //   console.error('[process-image]', error, {
    //     error,
    //     pathImg,
    //     originalImg,
    //   });
    //   debugger;
    //   return reject(error);
    // });
})

module.exports = {
  processImage,
  supportedMimetypes
}
