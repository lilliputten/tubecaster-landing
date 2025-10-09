<!--
 @since 2025.03.20, 10:02
 @changed 2025.03.22, 23:19
-->

# Simple tubecaster promo landing page based on a Themefisher template

This simple site based on the [Small Apps](https://themefisher.com/products/small-apps-bootstrap) themefisher bootstrap 4 template.

At the same time it's a playground for [Gulp LQIP small image placeholder generator](https://github.com/lilliputten/gulp-embed-lqip-as-background) plugin. ([LQIP](https://cloudinary.com/blog/low_quality_image_placeholders_lqip_explained) stands for "Low-quality image placeholders" technique to provide already prepared small resource-effective image previews.)

## Build info (auto-generated)

- Project info: tubecaster-landing v.0.0.6 / 2025.10.09 18:20:37 +0300

## Resources

- The project's repository: https://github.com/lilliputten/tubecaster-landing

- The deployed demo site: https://tubecaster.lilliputten.com/

## Maintenance

#### Install prerequisites (once for a machine)

* **Node Installation:** [Install node js](https://nodejs.org/en/download/)
* **Gulp Installation:** Install gulp globally from your terminal

```
npm install --global gulp-cli
```

Or visit the original [Gulp docs](https://gulpjs.com/docs/en/getting-started/quick-start)

#### Local setup

After successfully installing those dependencies, open this theme with any IDE [[VS Code](https://code.visualstudio.com/) recommended], and then open the internal terminal of IDM [vs code shortcut <code>ctrl/cmd+\`</code>]

* Install dependencies

```
pnpm install
```

* Run locally

```
pnpm run dev
```

After that, it will open up a preview of the template in your default browser, watch for changes to source files, and live reload the browser when changes are saved.

#### Production Build

After finishing all the customization, you can create a production build by running this command.

```
pnpm run build
```

