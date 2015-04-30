module.exports = function(app) {
    var Promise = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var _ = app.get('underscore');
    var Transaction = require('models/transaction')(app);
    var Action = require('models/action')(app);
    var debug = app.get('debug');
    
    var associatedActionName = "ACTION_UPDATE_RESOURCE";

    // Resource: represents a consumable resource
    var Resource = bookshelf.Model.extend({

        // tableName: provides the related database table name
        tableName: "resources",

        // initialize: run on object creation, registers event handlers
        initialize: function() {
            this.on("creating", this.onCreating, this);
            this.on("saving", this.onSaving, this);
        },

        // onCreating: 'creating' event handler, sets created_at to the current date
        onCreating: function(model, attrs, options) {
            model.set('created_at', new Date());
        },

        // onSaving: 'saving' event handler, creates a new update resource transaction for the user that is automatically complete
        onSaving: function(model, attrs, options) {
            model.set('updated_at', new Date());
            return new Action({ name: associatedActionName })
            .fetch({ required: true }).then(function(action) {
                new Transaction({ 
                    action_id: action.get('id'),
                    user_id: model.get('user_id'),
                    complete: true
                }).save();
            }).catch(function(err) {
                debug(err);
                throw err;
            });
        },

        // user: sets up relation to User model
        user: function() {
            return this.belongsTo('User');
        },

        // resourceType: sets up relation to ResourceType model
        resourceType: function() {
            return this.belongsTo('ResourceType');
        }
    }, {
        // Class Methods

        // validateRequest: validates a request body to confirm that resources can be successfully updated from the request. checks that each element has both 'id' and 'value' keys
        validateRequest: function(array) {
            return _.all(array, function(element) {
                return _.has(element, 'id') && _.has(element, 'value');
            });
        },

        // associatedActionName: returns the associated action name for updating resources
        associatedActionName: function() {
            return associatedActionName;
        }
    });

    if (!bookshelf.model('Resource')) {
        bookshelf.model('Resource', Resource);
    }

    return Resource;
};
