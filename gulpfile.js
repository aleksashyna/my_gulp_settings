var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var rigger = require('gulp-rigger');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

/**
 * Specify config for tasks
 */
var config = {

	  // SRC
    html: 'src/*.html',
    scss: 'src/scss/**/*.scss',
    images: 'src/images/*',
    fonts: 'src/fonts/*',
    css:[
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/normalize.css/normalize.css',
        'node_modules/slick-carousel/slick/slick.css',
        'src/css/**/*.css',
    ],
    scssAndCss:[
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/normalize.css/normalize.css',
        'node_modules/slick-carousel/slick/slick.css',
        'src/css/**/*.css',
        'src/scss/**/*.scss',
    ],
    js:
    [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'src/js/main.js'
    ],

    // DIST
    dist: 'dist',
    distJs: 'dist/js',
    distCss: 'dist/css',
    distImages: 'dist/images',
    distFonts: 'dist/fonts'
};

/**
 * Clear the destination folder
 */
gulp.task('clean', function () {
    gulp.src('dist/**/*.*', { read: false })
        .pipe(clean({ force: true }));
});

/**
 *  Copy all application files except *.sass .js and .html into the `dist` folder
 */
gulp.task('copy', function () {

    //copy fonts
    gulp.src(config.fonts)
        .pipe( gulp.dest(config.distFonts) ),

    //copy and minify images
    gulp.src(config.images)
        .pipe(imagemin())
        .pipe(gulp.dest(config.distImages));
});

/**
 * build js files into one bundle
 */
gulp.task('scripts', function() {
  return gulp.src(config.js)
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.distJs));
});

/**
 * compile sass into css and build into one bundle 
 */
gulp.task('scss', function () {
  return gulp.src(config.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 15 versions'],
        cascade: true
    }))
    .pipe(concat('scss.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.distCss));
});


/**
 * build css files into one bundle
 */
gulp.task('css', function() {
  return gulp.src(config.css)
    .pipe(sourcemaps.init())
    .pipe(concat('styles.css'))
    // .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.distCss));
});

/**
 * build production styles
 */
gulp.task('productionCss', function() {
  return gulp.src(config.scssAndCss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 15 versions'],
        cascade: true
    }))
    .pipe(concat('styles.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(config.distCss));
});

/**
 * build html files 
 */
gulp.task('html:build', function () {
    gulp.src(config.html) 
        .pipe(rigger()) 
        .pipe(gulp.dest(config.dist)); 
});

 /**
 * watch task
 */
gulp.task('watch', function () {
  //html:build
  gulp.watch(config.html, ['html:build']),

  //fonts
  gulp.watch(config.fonts, ['copy']),

  //images
  gulp.watch(config.images, ['copy']),

  //scss
  gulp.watch(config.scss, ['scss']),

  //css
  gulp.watch(config.css, ['css']),

  //js
  gulp.watch(config.js, ['scripts'])

});

/**
 * Default gulp task
 */
gulp.task('default', ['clean', 'copy', 'scripts', 'scss', 'css', 'html:build', 'watch']);

/**
 * Production gulp task
 */
gulp.task('production', ['clean', 'copy', 'scripts', 'productionCss', 'html:build']);

