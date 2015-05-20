module.exports = function(app) {
    var Promise   = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var debug     = app.get('debug');

    var Room = bookshelf.Model.extend({
        tableName: 'rooms',
        initialize: function() {
            this.on('creating', this.onCreating, this);
            this.on('saving', this.onSaving, this);
            this.on('saved', this.onSaved, this);
        },
        onCreating: function() {
            // todo: validate
        },
        onSaving: function() {
        },
        onSaved: function(model, attrs, options) {
            var Structure = bookshelf.model('Structure');
            var structure_id = model.get('structure_id');
            if (structure_id) {
                return new Structure({ id: structure_id }).fetch({ required: true }).then(function(structure) {
                    if (structure.get('room_id') !== model.get('id')) {
                        return structure.setRoom(model);
                    }
                });
            }
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
