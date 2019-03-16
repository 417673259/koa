const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('zip', () => gulp.src(['./**/*.*', './.babelrc', '!node_modules/**/*.*', '!gulpfile.js'])
  .pipe(zip('app.zip'))
  .pipe(gulp.dest('./dist')));
