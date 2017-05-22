var fs     = require('fs');
var gulp   = require('gulp');
var less   = require('gulp-less');
var uglify = require('gulp-uglify');
var prefix = require('gulp-autoprefixer');
var merge  = require('merge-stream');
var concat = require('gulp-concat-util'); // Makes concat.header, concat.footer available.
var babel  = require('gulp-babel');


// JS
gulp.task('typer', function() {
  console.log('Creating "typer.min.js" in root dir.');

  return gulp.src('typer.js')
    .pipe(babel({presets: ['es2015']}))
    .on('error', onError)
    .pipe(uglify())
    .on('error', onError)
    .pipe(concat('typer.min.js'))
    .on('error', onError)
    .pipe(gulp.dest('./'));
});

gulp.task('npm', function() {
  return gulp.src('typer.js')
    .pipe(concat('typer-npm.js'))
    .pipe(concat.footer('\nmodule.exports = typer;\n'))
    .pipe(gulp.dest(''));
});

// LESS > CSS
gulp.task('styles', function() {
  console.log('Creating prefixed "typer.css" in root dir.');
  console.log('Creating prefixed "typer.css" in demo dir.');

  var typer = gulp.src('less/typer.less')
    .pipe(less()) // typer.less > typer.css
    .on('error', onError)
    .pipe(prefix({browsers: ['last 2 versions', 'Explorer >= 9']}))
    .on('error', onError)
    .pipe(gulp.dest(''))
    .pipe(gulp.dest('demo'));

  console.log('Creating prefixed "demo.css" in demo dir.');

  var demo = gulp.src('less/demo.less')
    .pipe(less()) // demo.less > demo.css
    .on('error', onError)
    .pipe(prefix({browsers: ['last 2 versions', 'Explorer > 9']}))
    .on('error', onError)
    .pipe(gulp.dest('demo'));

  return merge(typer, demo);
});

// DATES
// Makes sure the dates in the license clauses always reflect the current year.
gulp.task('dates', function() {
  let year = new Date().getFullYear();
  let licenseArray = fs.readFileSync('./LICENSE.txt', 'utf-8').split(/\n/);
  let licenseLineArray = licenseArray[2].split(' ');
  let typerArray = fs.readFileSync('./typer.js', 'utf-8').split(/\n/);
  let typerLineArray = typerArray[2].split(' ');

  licenseLineArray.splice(2, 1, year);
  licenseArray.splice(2, 1, licenseLineArray.join(' '));
  typerLineArray.splice(2, 1, year);
  typerArray.splice(2, 1, typerLineArray.join(' '));

  fs.writeFileSync('./LICENSE.txt', licenseArray.join('\n'));
  fs.writeFileSync('./typer.js', typerArray.join('\n'));
});

// WATCH
gulp.task('default', function() {
  gulp.watch('typer.js', ['typer', 'npm', 'dates']);
  gulp.watch('less/*.less', ['styles']);
});

// http://goo.gl/SboRZI
// Prevents gulp from crashing on errors.
function onError(err) {
  console.log(err);
  this.emit('end');
}