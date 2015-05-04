'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('payouts', function(table) {
            table.increments();
            table.integer('module_id').references('id').inTable('modules').notNullable();
            table.integer('resource_id').references('id').inTable('resources').notNullable();
            table.integer('value').notNullable().defaultsTo(0);
            table.timestamps();
        }),

        knex.schema.createTable('yields', function(table) {
            table.increments();
            table.integer('module_type_id').references('id').inTable('module_types').notNullable();
            table.integer('level').notNullable();
            table.integer('duration').notNullable().defaultsTo(1);
            table.unique(['module_type_id', 'level']);
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('payouts'),
        knex.schema.dropTable('yields')
    ]);
};
