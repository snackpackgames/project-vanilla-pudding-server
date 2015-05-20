module.exports = function(app) {
    var Promise = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var debug = app.get('debug');

    var Structure = bookshelf.Model.extend({
        tableName: 'structures',
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
                    if (!room.get('structure_id')) {
                        return room.save({ structure_id: model.get('id') });
                    }
                });
            }
        },
        room: function() {
            return this.belongsTo('Room');
        },
        structureType: function() {
            return this.hasOne('StructureType');
        },
        setRoom: function(room) {
            return this.save({ room_id: room.get('id') });
        },
        verifyBuildRequirements: function() {
            return this.load(['structureType']).then(function(self) {
                var buildReqs = self.related('structureType').parseBuildRequirements();
                debug("Build requirements: %j", buildReqs);

                // Todo: Verify buildReqs
            });
        }
    }, {

    });

    if (!bookshelf.model('Structure')) {
        bookshelf.model('Structure', Structure);
    }

    return Structure;
};
