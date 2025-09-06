const path = require("path");

const sass = require("gulp-sass")(require("sass"));
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const fileinclude = require("gulp-file-include");
const autoprefixer = require("gulp-autoprefixer");
const bs = require("browser-sync").create();
const rimraf = require("rimraf");
const htmlmin = require("gulp-htmlmin");
const prettify = require("gulp-html-prettify");
const minify = require("gulp-minify");

const gulpEmbedLQIP = require("gulp-embed-lqip-as-background");

const paths = {
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
  },
};

/** HTML root path */
const lqipAbsPath = path.resolve(__dirname, "source");

// HTML
gulp.task("html_build", function () {
  return gulp
    .src(paths.src.html)
    .pipe(
      fileinclude({
        basepath: paths.src.incdir,
      })
    )
    .pipe(
      gulpEmbedLQIP({
        rootPath: lqipAbsPath,
        // dataSrcAttr: 'data-src', // Specify to produce old-way attributes (see an example in the `demo` folder).
        // lazyLoadClass: 'lazy-load',
        // srcAttr: 'src',
        // scaleFactorAttr: 'data-scale-factor',
        // scaleFactor: 10,
        // validFileExtensions: ['.html', '.htm'],
      })
    )
    .pipe(
      htmlmin({
        removeComments: true,
        collapseWhitespace: true,
      })
    )
    .pipe(prettify({ indent_char: " ", indent_size: 2 }))
    .pipe(gulp.dest(paths.build.dirBuild))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// SCSS
gulp.task("scss_build", function () {
  return gulp
    .src(paths.src.scss)
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
    .pipe(gulp.dest(paths.build.dirBuild + "css/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Javascript
gulp.task("js_build", function () {
  return gulp
    .src(paths.src.js)
    .pipe(sourcemaps.init())
    .pipe(
      minify({
        ext: {
          src: "-debug.js",
          min: ".js",
        },
        ignoreFiles: ["-min.js"],
        compress: {
          // https://lisperator.net/uglifyjs/compress
          drop_debugger: false,
        },
      })
    )
    .pipe(sourcemaps.write("/"))
    .pipe(gulp.dest(paths.build.dirBuild + "js/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Images
gulp.task("images_copy", function () {
  return gulp
    .src(paths.src.images)
    .pipe(gulp.dest(paths.build.dirBuild + "images/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Plugins
gulp.task("plugins_copy", function () {
  return gulp
    .src(paths.src.plugins)
    .pipe(gulp.dest(paths.build.dirBuild + "plugins/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Other files like favicon, php, sourcele-icon on root directory
gulp.task("others_copy", function () {
  return gulp.src(paths.src.others).pipe(gulp.dest(paths.build.dirBuild));
});

// Clean Build Folder
gulp.task("clean", function (cb) {
  rimraf(`${paths.build.dirBuild}*`, cb);
});

// Watch Task
gulp.task("watch_build", function () {
  gulp.watch(paths.src.html, gulp.series("html_build"));
  gulp.watch(paths.src.htminc, gulp.series("html_build"));
  gulp.watch(paths.src.scss, gulp.series("scss_build"));
  gulp.watch(paths.src.js, gulp.series("js_build"));
  gulp.watch(paths.src.images, gulp.series("images_copy"));
  gulp.watch(paths.src.plugins, gulp.series("plugins_copy"));
});

// Dev Task
gulp.task(
  "default",
  gulp.series(
    "clean",
    "html_build",
    "js_build",
    "scss_build",
    "images_copy",
    "plugins_copy",
    "others_copy",
    gulp.parallel("watch_build", function () {
      bs.init({
        open: false,
        // port: 3010,
        server: {
          baseDir: paths.build.dirBuild,
        },
      });
    })
  )
);

// Build Task
gulp.task(
  "build",
  gulp.series(
    "clean",
    "html_build",
    "js_build",
    "scss_build",
    "images_copy",
    "plugins_copy"
  )
);
