// Require dependencies
var express   = require('express'),
    _         = require('lodash'),  
    passport  = require('passport'),
    path      = require('path'),
    knex;

var app = express();

// Initialize DB
var config = require('knexfile')[process.env.CONFIGURATION_ENV] || {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
};

knex = require('knex')(config);

var bookshelf = require('bookshelf')(knex);

// Require routes
require('routes')(app);

// Start server
var port = process.env.PORT || 8000;
app.listen(port);

var appName = process.env.APPNAME || "project-vanilla-pudding-server";
console.log("Starting application: " + appName + " on port: " + port);
