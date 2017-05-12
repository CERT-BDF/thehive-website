var gulp = require('gulp');

/**
 * Development
 */

// LESS
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['> 1%'] });
var combiner = require('stream-combiner2');

gulp.task('less', function() {
  var combined = combiner.obj([
    gulp.src('app/assets/less/*.less'),
    less({
      plugins: [autoprefix]
    }),
    gulp.dest('app/assets/css'),
    browserSync.reload({
      stream: true
    })
  ]);

  // catch errors
  combined.on('error', console.error.bind(console));

  return combined;
});

// Browser-sync
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

// Watch
gulp.task('watch', ['browserSync', 'less'], function() {
  gulp.watch('app/assets/less/**/*.less', ['less']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/assets/js/**/*.js', browserSync.reload);
  // Other watchers
});


/**
 * Optimization
 */

// Del
var del = require('del');

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

// Useref
var gulpIf = require('gulp-if');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var cache = require('gulp-cache');

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
      // .pipe(gulpIf('*.js', uglify()))
      // .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'))
});

// Imagemin
var imagemin = require('gulp-imagemin');

gulp.task('images', function() {
  return gulp.src('app/assets/img/**/*.+(png|jpg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/assets/img'))
});

// Other
gulp.task('fonts', function() {
  return gulp.src('app/assets/fonts/**/*')
  .pipe(gulp.dest('dist/assets/fonts'))
});

gulp.task('ico', function() {
  return gulp.src('app/assets/ico/**/*')
  .pipe(gulp.dest('dist/assets/ico'))
});

gulp.task('plugins', function() {
  return gulp.src('app/assets/plugins/**/*')
  .pipe(gulp.dest('dist/assets/plugins'))
});

gulp.task('bootstrap', function() {
  return gulp.src('app/assets/bootstrap/**/*')
  .pipe(gulp.dest('dist/assets/bootstrap'))
});

gulp.task('js', function() {
  return gulp.src('app/assets/js/**/*')
  .pipe(gulp.dest('dist/assets/js'))
});

gulp.task('php', function() {
  return gulp.src('app/*.php')
  .pipe(gulp.dest('dist'))
});

gulp.task('css', function() {
  return gulp.src('app/assets/css/**/*')
  .pipe(gulp.dest('dist/assets/css'))
});

// Build
var runSequence = require('run-sequence');

gulp.task('build', function(callback) {
  runSequence('clean:dist', 
    ['less', 'useref', 'images', 'fonts', 'ico', 'plugins', 'bootstrap', 'php', 'css', 'js'], 
    callback);
});


/**
 * Default
 */

gulp.task('default', function (callback) {
  runSequence(['less','browserSync', 'watch'],
    callback
  )
});