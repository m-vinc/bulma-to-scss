const gulp = require('gulp')
const replace = require('gulp-replace')
const insert = require('gulp-insert')
const converter = require('sass-convert')
const runSequence = require('run-sequence')

gulp.task('bulmaConvert2', () => {
  return gulp.src('../bulma/sass/*/*')
    .pipe(converter({
      from: 'sass',
      to: 'scss',
      rename: true
    }))
    .pipe(replace('.sass"', '.scss"'))
    .pipe(replace('sass/', 'scss/'))
    .pipe(gulp.dest('./scss'))
})

gulp.task('bulmaConvert1', () => {
  return gulp.src('../bulma/bulma.sass')
      .pipe(converter({
        from: 'sass',
        to: 'scss',
        rename: true
      }))
      .pipe(replace('.sass"', '.scss"'))
      .pipe(replace('sass/', 'scss/'))
      .pipe(insert.append('@import "scss/extensions/extensions";'))
      .pipe(gulp.dest('./'))
})

gulp.task('bulma-extensions2', () => {
  return gulp.src('../bulma-extensions/*/*')
    .pipe(converter({
      from: 'sass',
      to: 'scss',
      rename: true
    }))
    .pipe(replace('.sass"', '.scss"'))
    .pipe(replace('sass/', 'scss/'))
    .pipe(gulp.dest('./scss/extensions'))
})

gulp.task('bulma-extensions1', () => {
  return gulp.src('../bulma-extensions/extensions.sass')
    .pipe(converter({
      from: 'sass',
      to: 'scss',
      rename: true
    }))
    .pipe(replace('.sass"', '.scss"'))
    .pipe(replace('sass/', 'scss/'))
    .pipe(gulp.dest('./scss/extensions'))
})

gulp.task('bulma', done => {
  runSequence('bulmaConvert1', 'bulmaConvert2', 'bulma-extensions1', 'bulma-extensions2', () => {
    done()
  })
})
