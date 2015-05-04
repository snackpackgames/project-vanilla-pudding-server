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
            bookshelf.knex('bases').del().then(done.bind(null, null));
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
    });

    describe('#onCreated()', function() {
        beforeEach(function(done) {
            bookshelf.knex('bases').del().then(done.bind(null, null));
        });

        it('should create the default rooms on create', function(done) {
            new Base({
                name: faker.company.companyName(),
                user_id: testUser.get('id'),
                level: 1
            }).save().then(function(base) {
                return base.load(['rooms']);
            }).then(function(base) {
                expect(base.related('rooms').length).to.equal(1);
                done();
            }).catch(function(err) {
                done(err);
            });
        });
    });

    describe('#onSaved()', function() {
        beforeEach(function(done) {
            bookshelf.knex('bases').del().then(done.bind(null, null));
        });

        it('should create new rooms to match base level on save', function(done) {
            new Base().save({
                name: faker.company.companyName(),
                user_id: testUser.get('id'),
                level: 1
            }).then(function(base) {
                return base.load(['rooms']);
            }).then(function(base) {
                expect(base.related('rooms').length).to.equal(1);
                return base.set('level', 3).save();
            }).then(function(base) {
                return base.load(['rooms']); 
            }).then(function(base) {
                expect(base.related('rooms').length).to.equal(3);
                done();
            });
        });
    });

    describe('#levelUp()', function() {
        var testBase;

        beforeEach(function(done) {
            bookshelf.knex('bases').del().then(function() {
                return new Base().save({
                    name: faker.company.companyName(),
                    user_id: testUser.get('id'),
                    level: 1
                });
            }).then(function(base) {
                testBase = base;
                done();
            });
        });

        it('should level up the base by one when the method is called', function(done) {
            testBase.levelUp().then(function(base) {
                expect(base.get('level')).to.equal(2);
                return base.levelUp();
            }).then(function(base) {
                expect(base.get('level')).to.equal(3);
                done();
            }).catch(done);
        });
    });

});
