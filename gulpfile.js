/**
 * Created by tutu on 15-12-17.
 */

var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('ts', function () {
    return gulp.src(['*.ts', 'core/**/*.ts', 'data/**/*.ts', 'module/**/*.ts'])
        .pipe(ts({
            noImplicitAny: true,
            outFile: '.',
            module: "commonjs",
            target: "es5",
            jsx: "react"
        }))
        .pipe(gulp.dest('/'));
});

var sass = require('gulp-sass');

gulp.task('sass', function () {
    gulp.src('./core/src/css/index.sass')
        .pipe(sass({
            outFile: '.'
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./static/css'));
});

var webpack = require('gulp-webpack');

gulp.task('webpack', function() {
    gulp.src('./core/src/index.js')
        .pipe(webpack({
          output: {
            path: "",
            filename: 'index.js'
          }
        }))
        .pipe(gulp.dest('./static/js'));
});
