
var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var CleanCSS = require('clean-css');

var cssfile = './lib/console.css';
var cssholder = '/* CONSOLE CSS */';

gulp.task('build', function(){
  gulp.src('lib/console.js')
  .pipe(replace(
    cssholder,
    new CleanCSS().minify(fs.readFileSync(cssfile)).styles)
  )
  .pipe(uglify())
  .pipe(rename('console.min.js'))
  .pipe(gulp.dest('./lib/'));
});

gulp.task('watch', function(){
  gulp.watch([
    'lib/console.css',
    'lib/console.js'
  ], ['build'])
})
