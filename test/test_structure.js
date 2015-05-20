process.env.CONFIGURATION_ENV = "test";

var expect     = require('chai').expect;
var app        = require('server')({ squelch: true });
var User       = require('models/user')(app);
var Base       = require('models/base')(app);
var Room       = require('models/room')(app);
var Structure  = require('models/structure')(app);
var StructureType = require('models/structure-type')(app);
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
var testStructureType;

describe('Structure', function() {
    beforeEach(function(done) {
        Promise.all([
            bookshelf.knex('users').del(),
            bookshelf.knex('bases').del(),
            bookshelf.knex('rooms').del(),
            bookshelf.knex('structures').del(),
            bookshelf.knex('structure_types').del()
        ]).then(function() {
            return Promise.all([
                new User().save(testUserData),
                new StructureType().save({
                    name: "Test",
                    description: "Test structure type",
                    personnel_slots_max: 2,
                    build_requirements: ""
                })
            ]);
        }).then(function(results) {
            testUser = results[0];
            testStructureType = results[1];
            return new Base().save({
                name: faker.company.companyName(),
                user_id: testUser.get('id'),
                level: 1
            });
        }).then(function(base) {
            testBase = base;
        }).then(done.bind(null, null));
    });

    it('should successfully create a structure for the specified user in the specified room', function(done) {
        var structure;
        var room;
        Promise.all([
            new Structure().save({
                structure_type_id: testStructureType.get('id'),
                level: 1
            }),
            testBase.load(['rooms'])
        ]).then(function(results) {
            structure = results[0];
            var base = results[1];
            room = base.related('rooms').at(0);
            return room.set('structure_id', structure.get('id')).save();
        }).then(function(room) {
            expect(room.get('structure_id')).to.equal(structure.get('id'));
            return structure.load(['room']);
        }).then(function(structure) {
            expect(structure.related('room').id).to.equal(room.get('id'));
            done();
        }).catch(done);
    });
    /*
    it('should not be able to build a structure when build_requirements are not met', function(done) {
        
    });

    describe('#setRoom()', function() {

    });
    */
});
