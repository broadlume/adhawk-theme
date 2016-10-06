const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const ghPages     = require('gulp-gh-pages');
const openUrl     = require('openurl');
const rimraf      = require('rimraf');

gulp.task('clean', (cb) => {
  return rimraf('./dist', cb);
});

gulp.task('html', ['clean'], () => {
  return gulp.src('./*.html').pipe(gulp.dest('./dist'));
});

gulp.task('sass', ['clean'], () => {
  return gulp.src(['./scss/theme.scss', './custom/custom.scss'])
    .pipe(sass({
      includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets'],
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', ['clean'], () => {
  return gulp.src('./node_modules/bootstap-sass/assets/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('js', ['clean'], () => {
  return gulp.src([
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    './node_modules/jquery/dist/jquery.min.js',
    './custom/*.js',
  ])
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', ['html', 'sass', 'fonts', 'js'], () => {
  browserSync.init({
    open: false,
    port: 3030,
    host: 'http://local.tryadhawk.com',
    server: './dist',
  }, () => openUrl.open('http://local.tryadhawk.com:3030'));

  gulp.watch('./scss/*.scss', ['sass']);
  gulp.watch('./index.html').on('change', browserSync.reload);
});

gulp.task('ghpages', () => {
  return gulp.src('./dist/**/*').pipe(ghPages());
});

gulp.task('deploy', ['ghpages'], () => {
  openUrl.open('http://adhawk.github.io/adhawk-theme');
});

gulp.task('default', ['watch']);
