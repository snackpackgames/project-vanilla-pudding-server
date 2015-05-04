process.env.CONFIGURATION_ENV = "test";

var expect  = require('chai').expect;
var bcrypt  = require('bcrypt');
var app     = require('server')({ squelch: true });
var User    = require('models/user')(app);
var faker   = require('faker');
var Promise = require('bluebird');


describe('User', function() {
    beforeEach(function(done) {
        // Clear the users database
        app.get('bookshelf').knex('users').del().then(function() {
            done();
        })
    });

    describe('#initialize()', function() {
        beforeEach(function(done) {
            app.get('bookshelf').knex('users').del().then(function() {
                done();
            });
        });

        it('should successfully create a user and save it to the database', function(done) {
            var userTestData = {
                first_name: "Test",
                last_name: "Test",
                email: "test@test.com",
                password: "secret"
            };
            new User(userTestData).save().then(function(user) {
                expect(user.get("first_name")).to.equal(userTestData.first_name);
                expect(user.get("last_name")).to.equal(userTestData.last_name);
                expect(user.get("email")).to.equal(userTestData.email);
                expect(user.get("password_hash")).to.not.be.null;
                done();
            });
        });

        it('should successfuly create multiple users and save them to the database', function(done) {
            // TODO: Create multiple users and save them, then confirm they are retrievable
            var usersPromises = [];
            for (var i = 0; i < 10; i++) {
                usersPromises.push(new User({
                    first_name: faker.name.firstName(),
                    last_name: faker.name.lastName(),
                    email: faker.internet.email(),
                    password: faker.internet.password()
                }).save());
            }

            Promise.all(usersPromises).then(function() {
                new User().fetchAll().then(function(results) {
                    expect(results.models.length).to.equal(usersPromises.length);
                    done();
                });
            });
        });

        it('should hash the user\'s password on create', function(done) {
            var password = 'secret';
            var userTestData = {
                first_name: "Test",
                last_name: "Test",
                email: "test@test.com",
                password: password
            };

            new User(userTestData).save().then(function(user) {
                expect(bcrypt.compareSync(password, user.get('password_hash'))).to.be.true;
                done(); 
            });
        });

        it('should reject duplicate emails, non-case-sensitive', function(done) {
            var email = faker.internet.email();
            var testUser1 = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: email.toLowerCase(),
                password: faker.internet.password()
            };
            
            var testUser2 = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: email.toUpperCase(),
                password: faker.internet.password()
            };

            new User(testUser1).save().then(function(user) {
                expect(user).to.not.be.null;
                return new User(testUser2).save();
            }).catch(function(error) {
                expect(error).to.not.be.null; 
                done();
            });
        });
    });

    describe('#toSecureJSON()', function() {
        var testEmail = "test@test.com";

        beforeEach(function(done) {
            new User({
                first_name: "Test",
                last_name: "Test",
                email: testEmail,
                password: "secret"
            }).save().then(function(user) {
                done();
            });
        });

        it('should return all properties of the model except for password and password_hash', function(done) {
            new User({ email: testEmail }).fetch({ require: true }).then(function(user) {
                userObj = user.toSecureJSON();
                expect(userObj).to.have.a.property('first_name');
                expect(userObj).to.have.a.property('last_name');
                expect(userObj).to.have.a.property('email');
                expect(userObj).not.to.have.a.property('password');
                expect(userObj).not.to.have.a.property('password_hash');
                done();
            });
        });
    });
});
