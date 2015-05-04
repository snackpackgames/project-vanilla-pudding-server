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
            this.on('created', this.onCreated, this);
            this.on('saving', this.onSaving, this);
            this.on('saved', this.onSaved, this);
        },
        onCreating: function(model, attrs, options) {

        },
        onCreated: function(model, attrs, options) {
            // Todo: Validate
            return new Room().save({
                base_id: model.get('id')
            });
        },
        onSaving: function(model, attrs, options) {

        },
        onSaved: function(model, attrs, options) {
            // Todo: Create rooms to match level
            return this.load(['rooms']).then(function(base) {
                var difference =  base.get('level') - base.related('rooms').length;
                var promises = [];
                for (var i = 0; i < difference; i++) {
                    promises.push(new Room({
                        base_id: base.get('id')
                    }).save());
                }
                return Promise.all(promises);
            }).then(function(results) {
                debug('Base %j saved: created rooms: %j', model, results);
            });
        },
        rooms: function() {
            return this.hasMany(Room, 'base_id');
        },
        _module: function() {
            return this.hasOne('Module');
        }
        levelUp: Promise.method(function() {
            return this.save({
                level: this.get('level') + 1
            });
        })
    }, {
                                     
    });

    if (!bookshelf.model('Base')) {
        bookshelf.model('Base', Base);
    }

    return Base;
};
