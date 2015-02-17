'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('less', function () {
  gulp.src('./src/stylesheets/**/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('build-example', ['less'], function () {
  var browserify = require('browserify');
  var b = browserify();
  b.add('./examples/src/index.js');
  b.transform('jadeify')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./examples'));
});

gulp.task('build', ['less']);
