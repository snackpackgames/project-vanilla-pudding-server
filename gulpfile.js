var gulp      = require('gulp'),
    gutil     = require('gulp-util'),
    jshint    = require('gulp-jshint'),
    shell     = require('gulp-shell'),
    fs        = require('fs'),
    bookshelf = require('bookshelf'),
    knex;

var config = require('knexfile');

gulp.task('default', ['test', 'watch']);

gulp.task('createdb', function() {
    return gulp.src('')
        .pipe(shell(['knex migrate:latest', 'knex seed:run']));
});

gulp.task('createtestdb', function() {
    return gulp.src('')
        .pipe(shell(['knex migrate:latest --env test']));
});

gulp.task('jshint', function() {
    return gulp.src(['src/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['jshint', 'createtestdb'], function() {
    return gulp.src('')
        .pipe(shell(['istanbul cover _mocha -- -R spec']));
});

gulp.task('watch', function() {
    gutil.log('gulp-watch is go!');
    return gulp.watch('src/**/*.js', ['jshint']);
});
