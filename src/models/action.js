module.exports = function(app) {
    var Promise = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var _ = app.get('underscore');

    var Action = bookshelf.Model.extend({
        tableName: "actions",
        initialize: function() { },
        transactions: function() {
            return this.hasMany('Transactions');
        }
    }, {

    });

    if (!bookshelf.model('Action')) {
        bookshelf.model('Action', Action);
    }

    return Action;
};
