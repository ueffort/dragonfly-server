/**
 * Created by tutu on 15-12-17.
 */

var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default', function () {
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
