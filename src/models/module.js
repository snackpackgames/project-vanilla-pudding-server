module.exports = function(app) {
    var Promise = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var debug = app.get('debug');

    var Module = bookshelf.Model.extend({
        tableName: 'modules',
        initialize: function() {
            this.on('creating', this.onCreating, this);
            this.on('created', this.onCreated, this);
            this.on('saving', this.onSaving, this);
            this.on('saved', this.onSaved, this);
        },
        onCreating: function(model, attrs, options) {
            this.set('created_at', new Date());
        },
        onCreated: function(model, attrs, options) {

        },
        onSaving: function(model, attrs, options) {
            this.set('updated_at', new Date());
        },
        onSaved: function(model, attrs, options) {
            // Save the room id
            if (model.get('room_id')) { 
                return new Room({ id: model.get('room_id') }).fetch({ required: true }).then(function(room) {
                    if (!room.get('module_id')) {
                        return room.save({ module_id: model.get('id') });
                    }
                });
            }
        },
        room: function() {
            return this.belongsTo('Room');
        },
        moduleType: function() {
            return this.hasOne('ModuleType', 'module_type_id');
        },
        setRoom: function(room) {
            return this.save({ room_id: room.get('id') });
        },
        verifyBuildRequirements: function() {
            return this.load(['moduleType']).then(function(module) {
                var buildReqs = module.related('moduleType').parseBuildRequirements();
                debug("Build reqirements: %j", buildReqs);

                // Todo: Verify buildReqs
            });
        }
    }, {

    });

    if (!bookshelf.model('Module')) {
        bookshelf.model('Module', Module);
    }

    return Module;
};
