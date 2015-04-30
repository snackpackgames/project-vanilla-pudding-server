'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('resource_types', function(table) {
            table.increments();
            table.string('name');
            table.text('description');
            table.float('exchange_rate');
        }),

        knex.schema.createTable('resources', function(table) {
            table.increments();
            table.integer('value');
            table.integer('user_id').references('id').inTable('users');
            table.integer('resource_type_id').references('id').inTable('resource_types');
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('resource_types'),
        knex.schema.dropTable('resources')
    ]);
};
