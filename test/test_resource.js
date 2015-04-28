process.env.CONFIGURATION_ENV = "test";

var expect    = require('chai').expect;
var app       = require('server');
var User      = require('models/user')(app);
var Resource  = require('models/resource')(app);
var Promise   = require('bluebird');
var bookshelf = app.get('bookshelf');


describe('Resource', function() {
    beforeEach(function(done) {
        // Clear the resources & users databases, create a base user for tests
        Promise.all([
            bookshelf.knex('resources').del(),
            bookshelf.knex('users').del(),
            User({
                id: 1,
                first_name: "test",
                last_name: "test",
                email: "test@test.com",
                password: "secret"
            }).save()
        ]).then(function() {
            done();
        });

        describe('#initialize()', function() {
            it('should successfully create resource objects for the specified user', function(done) {
                var user = new User({ id: 1 }).fetch({ required: true });
                var testData = {
                    value: 10,
                    resource_type_id: 1,
                    user_id: 1
                };

                new Resource(testData).save().then(function(resource) {
                    expect(resource.get('value')).to.be.equal.to(testData.value);  
                    user.then(function(user) {
                        expect(resource.user()).to.be.equal.to(user);
                        done();
                    });
                });
            });
        });
    });
});
