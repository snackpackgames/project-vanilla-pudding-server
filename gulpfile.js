var gulp      = require('gulp'),
    gutil     = require('gulp-util'),
    jshint    = require('gulp-jshint'),
    shell     = require('gulp-shell'),
    fs        = require('fs'),
    bookshelf = require('bookshelf'),
    knex;

var dbpath = process.env.SQLITE3_DB_PATH || './dev.sqlite3';

var config = require('knexfile')[process.env.CONFIGURATION_ENV] || {
    client: 'sqlite3',
    connection: {
      filename: dbpath
    }
};

knex = require('knex')(config);

gulp.task('default', ['test', 'watch']);

gulp.task('createdb', function() {
    return gulp.src('')
        .pipe(shell(['knex migrate:latest']))
        .on('finish', function() {
            gutil.log('Database successfully migrated');
        });
});

gulp.task('jshint', function() {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['jshint', 'createdb'], function() {
    // Run tests here
});

gulp.task('watch', function() {
    gutil.log('gulp-watch is go!');
    return gulp.watch('src/**/*.js', ['jshint']);
});
