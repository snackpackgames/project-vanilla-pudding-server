module.exports = function(app) {
    var bluebird = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var _ = app.get('underscore');

    Resource = bookshelf.Model.extend({
       tableName: "resources",
       initialize: function() {
            this.on("creating", this.onCreating);
        },
        onCreating: function() {
        },
        user: function() {
            return this.belongsTo('User');
        }
    }, {
        // Class methods will go here
        validateRequest: function(array) {
            return _.all(array, function(element) {
                return _.has(element, 'id') && _.has(element, 'value');
            });
        }
    });

    return Resource;
};
