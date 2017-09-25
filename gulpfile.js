const jshint = require('gulp-jshint');
const gulp   = require('gulp');
const gutil  = require('gulp-util');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');



gulp.task('default', function() {
  return gutil.log('Gulp started')
});


gulp.task('lint', function() {
  return gulp.src('./js/src/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('combine', function() {
  return gulp.src([
      './js/src/sdf-controller.js',
      './js/src/sdf-query.js',
      './js/src/sdf-toasts.js',
      './js/src/sdf-dropdown.js',
      './js/src/sdf-menu.js',
      './js/src/sdf-layout-menu.js',
      './js/src/sdf-license.js'
    ])
  .pipe(concat({ path: 'sdf.js'}))
  .pipe(gulp.dest('./js'));
});

gulp.task('compress', function () {
  return gulp.src('js/sdf.js')
    .pipe(uglify())
    .pipe(gulp.dest('js/dist'));
});

gulp.watch('js/src/*.js', ['lint', 'combine', 'compress']);