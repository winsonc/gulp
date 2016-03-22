var gulp             = require('gulp')
,	gutil            = require('gulp-util')

// CSS
,	sass             = require('gulp-sass')
,	csso             = require('gulp-csso')

// Javascript
,	coffee           = require('gulp-coffee')
,	uglify           = require('gulp-uglify')

// HTML
,	jade             = require('gulp-jade')

// Web server
,	express          = require('express')
,	app              = express()
,	path             = require('path')

// Live reload
,	livereload       = require('gulp-livereload')
,	tinylr           = require('tiny-lr')
,	open             = require('gulp-open')
;

var settings = {
	express: {
		port: 1337
	},
	livereload: {
		port: 35729
	}
};

// CSS
gulp.task('css', function () {
	return gulp
		.src('src/assets/stylesheets/*.sass')
		.pipe(
			sass({
				includePaths: ['src/assets/stylesheets'],
				errLogToConsole: true
			})
		)
		.pipe(csso())
		.pipe(gulp.dest('dist/assets/stylesheets'))
		.pipe(livereload());
});

// Javscript
gulp.task('javascript', function() {
	return gulp
		.src('src/assets/scripts/*.coffee')
		.pipe(coffee({ bare: true }).on('error', gutil.log))
		// .pipe(uglify())
		.pipe(gulp.dest('dist/assets/scripts'))
		.pipe(livereload());
});

// HTML
gulp.task('html', function () {
	return gulp
		.src('src/*.jade')
		.pipe(jade({ pretty: true }))
		.pipe(gulp.dest('dist/'))
		.pipe(livereload());
});

// Web server
gulp.task('express', function () {
	app.use(require('connect-livereload')());
	app.use(express.static(path.resolve('./dist')));
	app.listen(settings.express.port);
	gutil.log('Listening on port: ' + settings.express.port);
});

// Watch
gulp.task('watch', function (event) {
	livereload.listen(35729, function (err) {
		if (err) {
			return console.log(err);
		}
	});

	gulp.watch('src/assets/stylesheets/*.sass', ['css']);
	gulp.watch('src/assets/scripts/*.coffee', ['javascript']);
	gulp.watch('src/*.jade', ['html']);
});

// Browser
gulp.task('browser', function () {
	gulp
		.src(__filename)
		.pipe(open({ uri: 'http://127.0.0.1:' + settings.express.port }));
});

gulp.task('default', ['css', 'javascript', 'html', 'express', 'watch']);
