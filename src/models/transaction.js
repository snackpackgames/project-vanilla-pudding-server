module.exports = function(app) {
    var Promise = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var _ = app.get('underscore');
    
    var Transaction = bookshelf.Model.extend({
        tableName: "transactions",
        initialize: function() {
            this.on('saving', this.onSaving);
            this.on('creating', this.onCreating);
        },
        onCreating: function() {
            this.set('created_at', new Date());
        },
        onSaving: function() {
            this.set('updated_at', new Date());
        },
        user: function() {
            return this.belongsTo('User');
        },
        action: function() {
            return this.belongsTo('Action');
        }
    }, {

    });

    if (!bookshelf.model('Transaction')) {
        bookshelf.model('Transaction', Transaction);
    }

    return Transaction;
};
