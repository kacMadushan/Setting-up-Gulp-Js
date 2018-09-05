// All Dependencies List
//-----------------------------------------------
var gulp            = require('gulp');
var sass            = require('gulp-sass');
var watch           = require('gulp-watch');
var concat          = require('gulp-concat');
var plumber         = require('gulp-plumber');
var clean_css       = require('gulp-clean-css');
var uglify          = require('gulp-uglify');
var sourcemaps      = require('gulp-sourcemaps');
var prefixer        = require('gulp-autoprefixer');
var imagemin        = require('gulp-imagemin');
var browserSync     = require('browser-sync');


var src = {
    scss: "src/scss/**/*.scss",
    js: "src/scripts/*.js",
    images: "src/images/**/*"
}

var libs = {
    jquery: "bower_components/jquery/dist/jquery.js"
}

// fonts path
var fonts = {
    path : "bower_components/font-awesome/fonts/*.{ttf,woff,woff2,otf,eot,svg}"
}

// Build Public file
//--------------------------------------------------
var build = {
    css: "build/css",
    js: "build/js",
    fonts: "build/fonts/",
    min_css: "style.min.css",
    min_js: "main.min.js",
    images: "build/images",
    index: "build/**/*.html"
}

// Error Log
//--------------------------------------------------
var onError = function (err) {
    console.log(err);
    this.emit('end');
};

// Sass To CSS
//--------------------------------------------------
gulp.task('sass', function(){
    return gulp.src(src.scss)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(prefixer())
        .pipe(concat(build.min_css))
        .pipe(gulp.dest(build.css))
        .pipe(clean_css())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(build.css))
        .pipe(browserSync.reload({stream: true}));
});

// JavaScripts minify
//--------------------------------------------------
gulp.task('js', function(){
    return gulp.src([libs.jquery, src.js])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(uglify())
        .pipe(concat(build.min_js))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(build.js))
        .pipe(browserSync.reload({stream: true}));
});

// Fontawesome fonts
//--------------------------------------------------
gulp.task('fonts', function(){
    return gulp.src(fonts.path)
        .pipe(gulp.dest(build.fonts))
});

// Images optimizer
//--------------------------------------------------
gulp.task('img', function(){
    return gulp.src(src.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
        }))
        .pipe(gulp.dest(build.images))
});

//Watch Task
//--------------------------------------------------
gulp.task('watch', function(){
    browserSync.init({
        server: './build'
    });
    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.js, ['js']);
    gulp.watch(src.images, ['img']);
    gulp.watch(build.index).on('change', browserSync.reload);
});

//Default Task
//--------------------------------------------------
gulp.task('default', ['watch', 'sass', 'js', 'fonts', 'img']);