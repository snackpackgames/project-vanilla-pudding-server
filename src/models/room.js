module.exports = function(app) {
    var Promise   = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var debug     = app.get('debug');

    var Room = bookshelf.Model.extend({
        tableName: 'rooms',
        initialize: function() {
            this.on('creating', this.onCreating, this);
            this.on('saving', this.onSaving, this);
        },
        onCreating: function() {
            // todo: validate
        },
        onSaving: function() {
        },
        base: function() {
            return this.belongsTo('Base');
        }
    }, {

    });
    
    if (!bookshelf.model('Room')) {
        bookshelf.model('Room', Room);
    }

    return Room;
};
