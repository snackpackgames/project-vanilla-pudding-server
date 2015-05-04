process.env.CONFIGURATION_ENV = "test";

var expect = require('chai').expect;
var app = require('server')({ squelch: true });
var User = require('models/user')(app);
var Base = require('models/base')(app);
var Room = require('models/room')(app);
var Module = require('models/module')(app);
var ModuleType = require('models/module-type')(app);
var faker = require('faker');
var bookshelf.app.get('bookshelf');
var Promise = require('bluebird');

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
            ])
        }).then(function(user) {
            testUser = user;
        }).then(done.bind(null, null));
    });
});
