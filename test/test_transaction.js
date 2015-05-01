process.env.CONFIGURATION_ENV = "test";

var expect       = require('chai').expect;
var app          = require('server')({ squelch: true });
var Action       = require('models/action')(app);
var Transaction  = require('models/transaction')(app);
var ResourceType = require('models/resource-type')(app);
var Resource     = require('models/resource')(app);
var User         = require('models/user')(app);
var Promise      = require('bluebird');
var bookshelf    = app.get('bookshelf');

var testActionName = "ACTION_TEST_ACTION";
var testUserEmail = "test@test.com";
var testUser;
var testAction;
var testResourceType;
var resourceAction;

describe('Transaction', function() {

    beforeEach(function(done) {
        Promise.all([
            bookshelf.knex('transactions').del(),
            bookshelf.knex('actions').del(),
            bookshelf.knex('users').del(),
            bookshelf.knex('resources').del(),
            bookshelf.knex('resource_types').del()
        ]).then(function() {
            return Promise.all([
                new User({
                    first_name: "test",
                    last_name: "test",
                    email: testUserEmail,
                    password: "secret"
                }).save(),
                new ResourceType({
                    name: "Test Resource",
                    description: "This is a test resource type for testing",
                    exchange_rate: 1.0
                }).save(),
                new Action({
                    name: testActionName,
                    duration: 10
                }).save(),
                new Action({
                    name: Resource.associatedActionName(),
                    duration: 0
                }).save()
            ]);
        }).then(function() {
            return Promise.all([
                new User({ email: testUserEmail }).fetch({ required: true }),
                new ResourceType({ name: "Test Resource" }).fetch({ required: true }),
                new Action({ name: testActionName }).fetch({ required: true }),
                new Action({ name: Resource.associatedActionName() }).fetch({ required: true })
            ]);
        }).then(function(results) {
            testUser = results[0];
            testResourceType = results[1];
            testAction = results[2];
            resourceAction = results[3];
        }).then(function() {
            done();
        });
    });

    describe('#initialize()', function() {
        beforeEach(function(done) {
            bookshelf.knex('transactions').del().then(function() {
                done();
            });
        });

        it('should successfully create transaction objects for a specified user and action', function(done) {
            new Transaction({
                user_id: testUser.get('id'),
                action_id: testAction.get('id')
            }).save().then(function(transaction) {
                expect(transaction).to.not.be.null;
                expect(transaction.get('action_id')).to.equal(testAction.get('id'));
                return transaction.load(['user']);
            }).then(function(transaction) {
                expect(transaction.related('user').get('id')).to.equal(testUser.get('id'));
                done();
            });
        });
    });
});


