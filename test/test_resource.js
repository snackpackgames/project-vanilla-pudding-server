process.env.CONFIGURATION_ENV = "test";

var expect    = require('chai').expect;
var app       = require('server');
var User      = require('models/user')(app);
var Resource  = require('models/resource')(app);
var ResourceType = require('models/resource-type')(app);
var Promise   = require('bluebird');
var bookshelf = app.get('bookshelf');
var testUserEmail = "test@test.com";
var testResourceTypeId;


describe('Resource', function() {
    beforeEach(function(done) {
        // Clear the resources & users databases, create a base user for tests
        Promise.all([
            bookshelf.knex('resource_types').del(),
            bookshelf.knex('resources').del(),
            bookshelf.knex('users').del()
        ]).then(function() {
            return new User({
                first_name: "test",
                last_name: "test",
                email: testUserEmail,
                password: "secret"
            }).save();
        }).then(function() {
            return new ResourceType({
                name: "Test Resource",
                description: "This is a test resource type for testing",
                exchange_rate: 1.0
            }).save().then(function(resourceType) {
                testResourceTypeId = resourceType.get('id');
            });
        }).then(function() {
            done();
        })
    });

    describe('#initialize()', function() {
        it('should successfully create resource objects for the specified user', function(done) {
            Promise.all([
                new User({ email: testUserEmail }).fetch({ required: true }),
                new ResourceType({ id: testResourceTypeId }).fetch({ required: true })
            ]).then(function(results) {
                var user = results[0];
                var resourceType = results[1];
                var testData = {
                    value: 10,
                    resource_type_id: testResourceTypeId,
                    user_id: user.get('id')
                };

                new Resource(testData).save().then(function(resource) {
                    expect(resource).to.not.be.null;
                    expect(resource.get('value')).to.equal(testData.value);
                    resource.load(['user', 'resourceType']).then(function(resource) {
                        expect(resource.related('user').get('id')).to.equal(user.get('id'));
                        expect(resource.related('resourceType').get('id')).to.equal(resourceType.get('id'));
                        done();
                    });
                });
            });
        });
    });
});
