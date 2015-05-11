process.env.CONFIGURATION_ENV = "test";

var expect     = require('chai').expect;
var app        = require('server')({ squelch: true });
var User       = require('models/user')(app);
var Base       = require('models/base')(app);
var Room       = require('models/room')(app);
var Module     = require('models/module')(app);
var ModuleType = require('models/module-type')(app);
var faker      = require('faker');
var Promise    = require('bluebird');
var bookshelf  = app.get('bookshelf');

var testUserData = {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password()
};

var testUser;
var testBase;
var testModuleType;

describe('Module', function() {
    beforeEach(function(done) {
        Promise.all([
            bookshelf.knex('users').del(),
            bookshelf.knex('bases').del(),
            bookshelf.knex('rooms').del(),
            bookshelf.knex('modules').del(),
            bookshelf.knex('module_types').del()
        ]).then(function() {
            return Promise.all([
                new User().save(testUserData),
                new ModuleType().save({
                    name: "Test",
                    description: "Test module type",
                    personnel_slots_max: 2,
                    build_requirements: ""
                })
            ]);
        }).then(function(results) {
            testUser = results[0];
            testModuleType = results[1];
            return new Base().save({
                name: faker.company.companyName(),
                user_id: testUser.get('id'),
                level: 1
            });
        }).then(function(base) {
            testBase = base;
        }).then(done.bind(null, null));
    });

    it('should successfully create a module for the specified user in the specified room', function(done) {
        var _module;
        var room;
        Promise.all([
            new Module().save({
                module_type_id: testModuleType.get('id'),
                level: 1
            }),
            testBase.load(['rooms'])
        ]).then(function(results) {
            _module = results[0];
            var base = results[1];
            room = base.related('rooms').at(0);
            return room.set("module_id", _module.get('id')).save();
        }).then(function(room) {
            expect(room.get('module_id')).to.equal(_module.get('id'));
            return _module.load(['room'])
        }).then(function(_module) {
            console.log(_module.related('room'));
            expect(_module.related('room').get('id')).to.equal(room.get('id'));
            done();
        }).catch(done);
    });
    /*
    it('should not be able to build a module when build_requirements are not met', function(done) {
        
    });

    describe('#setRoom()', function() {

    });
    */
});
