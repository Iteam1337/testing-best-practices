'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');
var istanbul = require('gulp-istanbul');

gulp.task('test', function () {
  return gulp
    .src(['examples/**/index.js'])
    .pipe(plumber())
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .pipe(jshint())
    .pipe(jscs())
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
    .on('finish', function () {
      gulp
        .src(['examples/**/test.js'])
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jscs())
        .pipe(stylish.combineWithHintResults())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(mocha({
          reporter: 'spec'
        }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({
          thresholds: {
            global: 90
          }
        }));
    });
});

gulp.task('watch', function () {
  gulp.watch(['examples/**/*.js', 'examples/**/*.json'], ['test']);
});

gulp.task('default', ['test', 'watch']);
