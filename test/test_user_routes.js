process.env.CONFIGURATION_ENV = "test";

var http        = require('http');
var expect      = require('chai').expect;
var app         = require('server');
var User        = require('models/user')(app);
var bookshelf   = app.get('bookshelf');

describe('User routes', function() {
    beforeEach(function(done) {

    });

    describe("GET /api/user/:id", function() {

        it("should return the user object for the provided id", function(done) {

        });

        it("should return an error object if the provided id is not found", function(done) {

        });
    })
});
