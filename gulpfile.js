/**
 * Created by tutu on 15-12-17.
 */

var gulp = require('gulp');
var path = require("path");
var gutil = require("gulp-util");
var ts = require('gulp-typescript');

gulp.task('ts', function () {
    return gulp.src(['*.ts', 'core/**/*.ts', 'data/**/*.ts', 'module/**/*.ts'])
        .pipe(ts(require("./tsconfig").compilerOptions))
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

var webpack = require('webpack');

gulp.task("webpack", function(callback) {
    webpack({
        entry: {
            index: ["./core/src/index.js"]
        },
        output: {
            path: "static/js",
            filename: "[name].js"
        }
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        callback();
    });
});

var WebpackDevServer = require("webpack-dev-server");

gulp.task("webpack-dev-server", function(callback) {
    var compiler = webpack({
        entry: {
            "index": [
                'webpack-dev-server/client?http://localhost:9090',
                'webpack/hot/only-dev-server',
                './core/src/index.js'
            ]
        },
        output: {
            path: path.join(__dirname, 'static/js'),
            filename: '[name].js',
            publicPath: 'http://localhost:9090/static/js'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
        resolve: {
            extensions: ['', '.js']
        },
        module: {
            loaders: [{
                test: /\.js$/,
                loaders: ['react-hot'],
                include: [path.join(__dirname, './core/src')]
            }]
        }
    });
    new WebpackDevServer(compiler, {
        publicPath: "http://localhost:9090/static/js",
        hot: true,
        historyApiFallback: true
    }).listen(9090, function (err, result) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        callback();
    });
});
