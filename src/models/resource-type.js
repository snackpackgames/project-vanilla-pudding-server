module.exports = function(app) {
    var Promise = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var _ = app.get('underscore');

    var ResourceType = bookshelf.Model.extend({
        tableName: "resource_types",
        intialize: function() {
            this.on('saving', this.onSaving);
        },
        onSaving: function() {
            if (this.get('exchange_rate') < 0) {
                this.set('exchange_rate', 0);
            }
        },
        resources: function() {
            return this.hasMany('Resources');
        }
    }, {

    });
    
    if (!bookshelf.model('ResourceType')) {
        bookshelf.model('ResourceType', ResourceType);
    }

    return ResourceType;
};
