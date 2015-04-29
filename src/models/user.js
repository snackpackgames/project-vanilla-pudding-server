module.exports = function(app) {
    var bcrypt = require('bcrypt');
    var bluebird = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var _ = app.get('underscore');

    var User = bookshelf.Model.extend({
        tableName: 'users',
        initialize: function() {
            this.on('creating', this.onCreating);
            this.on('saving', this.onSaving);
        },
        format: function(attrs) {
            return _.omit(attrs, 'password');
        },
        onCreating: function() {
            this.hashPassword();
            this.set('created_at', new Date());
        },
        onSaving: function() {
            this.set('updated_at', new Date());
        },
        hashPassword: function() {
            var password = this.get('password');
            var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
            this.set('password_hash', hash);
        },
        toSecureJSON: function() {
            return _.omit(this.toJSON(), ['password', 'password_hash']);
        },
        resources: function() {
            return this.hasMany('Resource');
        },
        transactions: function() {
            return this.hasMany('Transactions');
        }
    }, {
        login: bluebird.method(function(email, password) {
            if (!email || !password) throw new Error('Email and password are both required');
            return new this({ email: email.toLowerCase().trim() }).fetch({ required: true }).tap(function(user) {
                return bcrypt.compare(password, user.get('password_hash'));        
            });
        })
    });

    if (!bookshelf.model('User')) {
        bookshelf.model('User', User);
    }

    return User;
};
