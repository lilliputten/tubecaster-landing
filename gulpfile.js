"use strict";

const sass = require("gulp-sass")(require("sass"));
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const fileinclude = require("gulp-file-include");
const autoprefixer = require("gulp-autoprefixer");
const bs = require("browser-sync").create();
const rimraf = require("rimraf");
// const comments = require("gulp-header-comment");
const htmlmin = require("gulp-htmlmin");
const prettify = require("gulp-html-prettify");
const minify = require("gulp-minify");

const sharedComments = `
WEBSITE: http://tubecaster.lilliputten.com/
TELEGRAM: https://t.me/tubecasterbot
GITHUB: https://github.com/lilliputten/tubecaster-telegram-bot
`;

const path = {
  src: {
    html: "source/*.html",
    others: "source/*.+(php|ico|png)",
    htminc: "source/partials/**/*.htm",
    incdir: "source/partials/",
    plugins: "source/plugins/**/*.*",
    js: "source/js/*.js",
    scss: "source/scss/**/*.scss",
    images: "source/images/**/*.+(png|jpg|gif|svg)",
  },
  build: {
    dirBuild: "build/",
    dirDev: "build/",
  },
};

// HTML
gulp.task("html_build", function () {
  return (
    gulp
      .src(path.src.html)
      .pipe(
        fileinclude({
          basepath: path.src.incdir,
        })
      )
      .pipe(
        htmlmin({
          removeComments: true,
          collapseWhitespace: true,
        })
      )
      // .pipe(comments(sharedComments))
      .pipe(prettify({ indent_char: " ", indent_size: 2 }))
      .pipe(gulp.dest(path.build.dirDev))
      .pipe(
        bs.reload({
          stream: true,
        })
      )
  );
});

// SCSS
gulp.task("scss_build", function () {
  return (
    gulp
      .src(path.src.scss)
      .pipe(sourcemaps.init())
      .pipe(
        sass({
          sourceMap: true,
          outputStyle: "expanded",
          quietDeps: true,
          silenceDeprecations: [
            // @see node_modules/sass/types/deprecations.d.ts
            "legacy-js-api",
            "import",
            "color-functions",
            "global-builtin",
          ],
        }).on("error", sass.logError)
      )
      .pipe(autoprefixer())
      .pipe(sourcemaps.write("/"))
      // .pipe(comments(sharedComments))
      .pipe(gulp.dest(path.build.dirDev + "css/"))
      .pipe(
        bs.reload({
          stream: true,
        })
      )
  );
});

// Javascript
gulp.task("js_build", function () {
  return (
    gulp
      .src(path.src.js)
      .pipe(sourcemaps.init())
      // .pipe(comments(sharedComments))
      .pipe(
        minify({
          ext: {
            src: "-debug.js",
            min: ".js",
          },
          // exclude: ["tasks"],
          ignoreFiles: [".combo.js", "-min.js"],
          compress: {
            // https://lisperator.net/uglifyjs/compress
            drop_debugger: false,
          },
        })
      )
      .pipe(sourcemaps.write("/"))
      .pipe(gulp.dest(path.build.dirDev + "js/"))
      .pipe(
        bs.reload({
          stream: true,
        })
      )
  );
});

// Images
gulp.task("images_build", function () {
  return gulp
    .src(path.src.images)
    .pipe(gulp.dest(path.build.dirDev + "images/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Plugins
gulp.task("plugins_build", function () {
  return gulp
    .src(path.src.plugins)
    .pipe(gulp.dest(path.build.dirDev + "plugins/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Other files like favicon, php, sourcele-icon on root directory
gulp.task("others_build", function () {
  return gulp.src(path.src.others).pipe(gulp.dest(path.build.dirDev));
});

// Clean Build Folder
gulp.task("clean", function (cb) {
  rimraf(path.build.dirDev, cb);
});

// Watch Task
gulp.task("watch_build", function () {
  gulp.watch(path.src.html, gulp.series("html_build"));
  gulp.watch(path.src.htminc, gulp.series("html_build"));
  gulp.watch(path.src.scss, gulp.series("scss_build"));
  gulp.watch(path.src.js, gulp.series("js_build"));
  gulp.watch(path.src.images, gulp.series("images_build"));
  gulp.watch(path.src.plugins, gulp.series("plugins_build"));
});

// Dev Task
gulp.task(
  "default",
  gulp.series(
    "clean",
    "html_build",
    "js_build",
    "scss_build",
    "images_build",
    "plugins_build",
    "others_build",
    gulp.parallel("watch_build", function () {
      bs.init({
        open: false,
        server: {
          baseDir: path.build.dirDev,
        },
      });
    })
  )
);

// Build Task
gulp.task(
  "build",
  gulp.series(
    "html_build",
    "js_build",
    "scss_build",
    "images_build",
    "plugins_build"
  )
);
