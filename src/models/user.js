module.exports = function(app) {
    var bcrypt = require('bcrypt');
    var bluebird = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var _ = app.get('underscore');

    User = bookshelf.Model.extend({
        tableName: "users",
        initialize: function() {
            this.on("creating", this.onCreating);
        },
        format: function(attrs) {
            return _.omit(attrs, 'password');
        },
        onCreating: function() {
            this.hashPassword();
        },
        hashPassword: function() {
            var password = this.get('password');
            var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
            this.set('password_hash', hash);
        }
    }, {
        login: bluebird.method(function(email, password) {
            if (!email || !password) throw new Error('Email and password are both required');
            return new this({ email: email.toLowerCase().trim() }).fetch({ required: true }).tap(function(user) {
                return bcrypt.compare(password, user.get('password_hash'));        
            });
        })
    });

    return User;
};
