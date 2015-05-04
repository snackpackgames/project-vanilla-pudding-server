process.env.CONFIGURATION_ENV = "test";
process.env.DEBUG = "";
var port = process.env.PORT || 8000;

var util        = require('util');
var request     = require('request');
var expect      = require('chai').expect;
var app         = require('server')({ squelch: true });
var User        = require('models/user')(app);
var faker       = require('faker');
var bookshelf   = app.get('bookshelf');
var Promise     = require('bluebird');

var testUserData = {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password()
};

var testUserId;

app.listen(port);

describe('User routes', function() {
    beforeEach(function(done) {
        Promise.all([
            bookshelf.knex('users').del(),
            new User(testUserData).save()
        ]).then(function(results) {
            var user = results[1];
            testUserId = user.get('id');
            done();
        });
    });

    describe("GET /api/user/:id", function() {

        it("should return the user object for the provided id", function(done) {
            var url = util.format('http://localhost:%s/api/user/%d', port, testUserId);
            var options = {
                url: url,
                method: 'GET'
            };

            request(options, function(error, res, body) {
                var resultUser = JSON.parse(body);
                expect(resultUser.id).to.equal(testUserId);
                expect(resultUser.first_name).to.equal(testUserData.first_name);
                expect(resultUser.last_name).to.equal(testUserData.last_name);
                expect(resultUser.email).to.equal(testUserData.email);
                done();
            });
        });

        it("should return an error object if the provided id is not found", function(done) {
            
            var url = util.format('http://localhost:%s/api/user/%d', port, 0);
            var options = {
                url: url,
                method: 'GET'
            };

            request(options, function(error, res, body) {
                var response = JSON.parse(body);
                expect(res.statusCode).to.equal(404);
                expect(response).to.have.a.property('message');
                done();
            });
        });
    });

    describe("GET /api/user/login", function() {
        it("should be able to log in with valid user credentials", function(done) {
            var url = util.format('http://localhost:%s/api/user/login', port);
            var options = {
                url: url,
                method: 'POST',
                auth: {
                    username: testUserData.email,
                    password: testUserData.password
                }
            };

            request(options, function(error, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });
});
