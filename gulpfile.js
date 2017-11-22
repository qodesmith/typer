const fs     = require('fs');
const gulp   = require('gulp');
const prefix = require('gulp-autoprefixer');
const less   = require('gulp-less');
const uglify = require('uglify-es');
const babel  = require('babel-core');


// JAVASCRIPT
gulp.task('babel', function(done) {
  const code = fs.readFileSync('./typer.js', 'utf-8').split('\n');
  const beginning = code.slice(0, 27);
  const typer = code.slice(beginning.length, -3);
  const end = code.slice(beginning.length + typer.length);
  const results = babel.transform(typer.join('\n'), {
    presets: ['env', 'stage-0']
  });

  // * NOTE: `typer-es5.js` is created so we can see babel's output.

  fs.writeFileSync('typer-es5.js', beginning.join('\n') + results.code + end.join('\n'));
  fs.writeFileSync('typer.min.js', beginning.join('\n') + results.code + end.join('\n'));
  done();
});
gulp.task('uglify', function(done) {
  const code = fs.readFileSync('./typer.min.js', 'utf-8');
  const results = uglify.minify(code, { // https://goo.gl/Sb9eUd
    warnings: 'verbose',
    // parse: {},
    compress: {
      dead_code: true,
      drop_debugger: true,
      conditionals: true,
      evaluate: true,
      booleans: true,
      loops: true,
      unused: true,
      toplevel: true,
      if_return: true,
      join_vars: true,
      cascade: true,
      reduce_vars: true,
      warnings: true,
      passes: 3
    },
    // mangle: {
    //   properties: {}
    // },
    output: {},
    sourceMap: false, // default
    toplevel: true // default
  }).code;

  fs.writeFileSync('typer.min.js', results);
  done();
});

// DATES
// Makes sure the dates in the license clauses always reflect the current year.
gulp.task('dates', function(done) {
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

  done();
});

gulp.task('minify', gulp.series('dates', 'babel', 'uglify'));

// LESS > CSS
gulp.task('styles', function() {
  return gulp
    .src('less/typer.less')
    .pipe(less()) // typer.less > typer.css
    .on('error', onError)
    .pipe(prefix({browsers: ['last 2 versions']}))
    .on('error', onError)
    .pipe(gulp.dest('./'));
});

gulp.task('demo-styles', function() {
  return gulp
    .src('less/demo.less')
    .pipe(less())
    .on('error', onError)
    .pipe(prefix({browsers: ['last 2 versions']}))
    .on('error', onError)
    .pipe(gulp.dest('./demo'));
});

// WATCH
gulp.task('default', function() {
  gulp.watch('less/*.less', gulp.series('styles', 'demo-styles'));
});

// http://goo.gl/SboRZI
// Prevents gulp from crashing on errors.
function onError(err) {
  console.log(err);
  this.emit('end');
}