/* jshint -W079 */

// Load plugins
var gulp = require('gulp');

var sourcemaps = require('gulp-sourcemaps');
// var babel = require('gulp-babel');
var concat = require('gulp-concat');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var del = require('del');
var runSequence = require('run-sequence');
var argv = require('yargs').argv;

var source = __dirname + '/src';
var dist = __dirname + '/dist';


// Local connect server for testing
gulp.task('connect', function() {
	connect.server({
		root: './',
		port: argv.port || 5000,
		hostname: '*', // to allow access to server from outside
		livereload: {
			port: 35731
		}
	});
});

// // Babel standalone
// gulp.task('babel', function () {
//   return gulp.src('src/**/*.js')
//     .pipe(sourcemaps.init())
//     .pipe(babel())
//     .pipe(concat('tesserae.js'))
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest('dist'))
// 	.pipe(connect.reload());
// });

// Webpack
gulp.task('webpack', function() {
	return gulp.src(source + '/tesserae.js')
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest(dist))
		.pipe(connect.reload());
});

// Uglify output
gulp.task('uglify', function() {
	return gulp.src(dist + '/js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(dist + '/js'));
});

// Clean
gulp.task('clean', function(cb) {
	del([dist], cb);
});

// Lint
gulp.task('lint', function() {
    return gulp.src([
			source + '/js/**/*.js',
			'!' + source + '/js/vendor/**/*.js'
		])
	    .pipe(jshint())
	    .pipe(jshint.reporter(stylish));
});

// Watch
gulp.task('watch', function() {
	// Watch .js files
	gulp.watch(source + '/**/*.js', ['webpack']);
});

// Build (base build tasks, for dev)
gulp.task('build', function(callback) {
	var start = new Date().getTime();
	runSequence('clean', 'webpack', callback);
});

// Run in dev mode with static pages
gulp.task('run', function(callback) {
	runSequence('build', 'connect', 'watch', callback);
});

// Default task
gulp.task('default', function() {
	gulp.start('run');
});