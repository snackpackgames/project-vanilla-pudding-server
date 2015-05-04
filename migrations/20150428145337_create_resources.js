'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('resource_types', function(table) {
            table.increments();
            table.string('name').notNullable();
            table.text('description').notNullable();
            table.float('exchange_rate').notNullable();
        }),

        knex.schema.createTable('resources', function(table) {
            table.increments();
            table.integer('value').notNullable().defaultTo(0);
            table.integer('user_id').references('id').inTable('users').notNullable();
            table.integer('resource_type_id').references('id').inTable('resource_types').notNullable();
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
