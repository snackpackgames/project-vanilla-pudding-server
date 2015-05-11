module.exports = function(app) {
    var Promise = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var debug = app.get('debug');

    var ModuleType = bookshelf.Model.extend({
        tableName: 'module_types',
        initialize: function() {

        },
        parseBuildRequirements: function() {
            // Todo: parse and return build requirements based off of visual string
        },
        modules: function() {
            return this.belongsToMany('Module');
        }
    }, {
    });

    if (!bookshelf.model('ModuleType')) {
        bookshelf.model('ModuleType', ModuleType);
    }

    return ModuleType;
};
