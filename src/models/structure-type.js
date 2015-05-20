module.exports = function(app) {
    var Promise = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var debug = app.get('debug');

    var StructureType = bookshelf.Model.extend({
        tableName: 'structure_types',
        initialize: function() {

        },
        parseBuildRequirements: function() {
            // Todo: parse and return build requirements based off of visual string
        },
        modules: function() {
            return this.belongsToMany('Structure');
        }
    }, {
    });

    if (!bookshelf.model('StructureType')) {
        bookshelf.model('StructureType', StructureType);
    }

    return StructureType;
};
