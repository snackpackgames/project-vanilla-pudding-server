module.exports = function(app) {
    var Promise   = require('bluebird');
    var bcrypt    = app.get('bcrypt');
    var bookshelf = app.get('bookshelf');
    var debug     = app.get('debug');
    var Room      = require('models/room')(app);

    var Base = bookshelf.Model.extend({
        tableName: 'bases',
        initialize: function() {
            this.on('creating', this.onCreating, this);
            this.on('saving', this.onSaving, this);
        },
        onCreating: function() {
            // Todo: Validate
            // Todo: create rooms
        },
        onSaving: function() {

        },
        rooms: function() {
            return this.hasMany(Room, 'base_id');
        }
    }, {
                                     
    });

    if (!bookshelf.model('Base')) {
        bookshelf.model('Base', Base);
    }

    return Base;
};
