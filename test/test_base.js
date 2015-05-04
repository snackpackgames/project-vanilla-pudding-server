process.env.CONFIGURATION_ENV = "test";

var expect = require('chai').expect;
var app = require('server')({ squelch: true });
var Base = require('models/base')(app);
var Room = require('models/room')(app);
var User = require('models/user')(app);
var faker = require('faker');
var bookshelf = app.get('bookshelf');
var Promise   = require('bluebird');

var testUserData = {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password()
};
var testUser;

describe('Base', function() {
    beforeEach(function(done) {
        Promise.all([
            bookshelf.knex('users').del(),
            bookshelf.knex('bases').del(),
            bookshelf.knex('rooms').del()
        ]).then(function() {
            return new User(testUserData).save();
        }).then(function(user) {
            testUser = user;
        }).then(done.bind(null, null));
    });

    describe('#initialize()', function() {
        beforeEach(function(done) {
            bookshelf.knex('bases').del().then(function() {
                done();
            });
        });

        it('should successfully create a new base for the specified user', function(done) {
            new Base({
                name: faker.company.companyName(),
                user_id: testUser.get('id'),
                level: 1
            }).save().then(function(base) {
                expect(base).to.not.be.null;
                expect(base.get('user_id')).to.equal(testUser.get('id'));
                expect(base.get('level')).to.equal(1);
                done();
            }).catch(function(err) { done(err);
            });
        });

        it('should create the default rooms on create', function(done) {
            // Test create 
            new Base({
                name: faker.company.companyName(),
                user_id: testUser.get('id'),
                level: 1
            }).save().then(function(base) {
                return base.load(['rooms']);
            }).then(function(base) {
                expect(base.related('rooms').length).to.be.greaterThan(0);
                done();
            }).catch(function(err) {
                done(err);
            });
        });
    });


});
