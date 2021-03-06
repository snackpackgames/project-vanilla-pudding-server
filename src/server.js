// Require dependencies
var express        = require('express'),
    _              = require('lodash'),  
    passport       = require('passport'),
    path           = require('path'),
    bodyParser     = require('body-parser'),
    cookieParser   = require('cookie-parser'),
    morgan         = require('morgan'),
    debug          = require('debug')('development'),
    expressSession = require('express-session'),
    knex;

var app = express();

// Set libraries
app.set('underscore', _);
app.set('debug', debug);

// Initialize DB
var config = require('knexfile')[process.env.CONFIGURATION_ENV] || {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
};

knex = require('knex')(config);

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');
app.set('bookshelf', bookshelf);

// Set up middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(expressSession({
    secret: process.env.EXPRESS_SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('passport', passport);

require('passport-init')(passport, require('models/user')(app));

// Require routes
require('routes')(app, express);

// Start server
var port = process.env.PORT || 8000;
app.listen(port);

var appName = process.env.APPNAME || "project-vanilla-pudding-server";
console.log("Starting application: " + appName + " on port: " + port);

module.exports = app;
