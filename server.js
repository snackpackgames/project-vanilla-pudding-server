// Require dependencies
var express   = require('express'),
    bookshelf = require('bookshelf'),
    _         = require('lodash'),  
    passport  = require('passport');

var app = express();

// Require routes
require('./routes')(app);

var port = process.env.PORT || 8000;
app.listen(port);

var appName = process.env.APPNAME || "project-vanilla-pudding-server";
console.log("Starting application: " + appName + " on port: " + port);
