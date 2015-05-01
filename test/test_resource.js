process.env.CONFIGURATION_ENV = "test";

var expect    = require('chai').expect;
var app       = require('server')({ squelch: true });
var User      = require('models/user')(app);
var Resource  = require('models/resource')(app);
var ResourceType = require('models/resource-type')(app);
var Action    = require('models/action')(app);
var Transaction = require('models/transaction')(app);
var Promise   = require('bluebird');
var bookshelf = app.get('bookshelf');
var testUser;
var testResourceType;
var resourceAction


describe('Resource', function() {
    beforeEach(function(done) {
        // Clear the resources & users databases, create a base user for tests
        Promise.all([
            bookshelf.knex('resource_types').del(),
            bookshelf.knex('resources').del(),
            bookshelf.knex('users').del(),
            bookshelf.knex('transactions').del(),
            bookshelf.knex('actions').del()
        ]).then(function() {
            return Promise.all([
                new User({
                    first_name: "test",
                    last_name: "test",
                    email: "test@test.com",
                    password: "secret"
                }).save(),
                new ResourceType({
                    name: "Test Resource",
                    description: "This is a test resource type for testing",
                    exchange_rate: 1.0
                }).save(),
                new Action({
                    name: Resource.associatedActionName(),
                    duration: 0
                }).save()
            ]);
        }).then(function(results) {
            testUser = results[0];
            testResourceType = results[1];
            resourceAction = results[2];
        }).then(function() {
            done();
        })
    });

    describe('#initialize()', function() {
        beforeEach(function(done) {
            bookshelf.knex('resources').del().then(function() {
                done();
            });
        });

        it('should successfully create resource objects for a specified user', function(done) {
            var testData = {
                value: 10,
                resource_type_id: testResourceType.get('id'),
                user_id: testUser.get('id')
            };

            new Resource(testData).save().then(function(resource) {
                expect(resource).to.not.be.null;
                expect(resource.get('value')).to.equal(testData.value);
                expect(resource.get('created_at')).to.not.be.null;
                resource.load(['user', 'resourceType']).then(function(resource) {
                    expect(resource.related('user').get('id')).to.equal(testUser.get('id'));
                    expect(resource.related('resourceType').get('id')).to.equal(testResourceType.get('id'));
                    done();
                });
            });
        });

        it('should save the current date and time in created_at on create', function(done) {
            var currentDate = new Date();
            var testData = {
                value: 1000,
                resource_type_id: testResourceType.get('id'),
                user_id: testUser.get('id')
            };

            new Resource(testData).save().then(function(resource) {
                expect(resource.get('created_at').valueOf()).to.be.closeTo(currentDate.valueOf(), 10);
                done();
            });
        });
    });

    describe('#onSaving()', function() {
        beforeEach(function(done) {
            bookshelf.knex('transactions').del().then(function() {
                done();
            });
        });

        it('should automatically create transaction objects when the user\'s resources are modified', function(done) {
            new Transaction().fetchAll().then(function(transactions) {
                expect(transactions.models.length).to.equal(0);
                return new Resource({
                    user_id: testUser.get('id'),
                    resource_type_id: testResourceType.get('id'),
                    value: 10
                }).save();
            }).then(function(results) {
                return new Transaction({
                    action_id: resourceAction.get('id'),
                    user_id: testUser.get('id')
                }).fetchAll();
            }).then(function(transactions) {
                expect(transactions.length).to.equal(1);
                done();
            });
        });

        it('should create as many transaction objects as modified resources', function(done) {
            var createdCount = 0;
            new Resource({
                user_id: testUser.get('id'),
                resource_type_id: testResourceType.get('id'),
                value: 0
            }).save().then(function(resource) {
                createdCount++;
                return Promise.all([
                    resource.set('value', 30).save().then(function() { createdCount++; }),
                    resource.set('value', 50).save().then(function() { createdCount++; }),
                    resource.set('value', 100).save().then(function() { createdCount++; })
                ]);
            }).then(function() {
                return new Transaction({
                    action_id: resourceAction.get('id'),
                    user_id: testUser.get('id')
                }).fetchAll();
            }).then(function(transactions) {
                expect(transactions.length).to.equal(createdCount);
                done();
            });
        });


        it('should save the current date and time in updated_at on save', function(done) {
            var lastSavedDate = new Date();
            new Resource({
                user_id: testUser.get('id'),
                resource_type_id: testResourceType.get('id'),
                value: 0
            }).save().then(function(resource) {
                expect(resource.get('updated_at').valueOf()).to.be.closeTo(lastSavedDate.valueOf(), 10);
                lastSavedDate = new Date();
                return resource.set('value', 10).save();
            }).then(function(resource) {
                expect(resource.get('updated_at').valueOf()).to.be.closeTo(lastSavedDate.valueOf(), 10);
                lastSavedDate = new Date();
                return resource.set('value', 50).save();
            }).then(function(resource) {
                expect(resource.get('updated_at').valueOf()).to.be.closeTo(lastSavedDate.valueOf(), 10);
                done();
            });
        });
    });
});
