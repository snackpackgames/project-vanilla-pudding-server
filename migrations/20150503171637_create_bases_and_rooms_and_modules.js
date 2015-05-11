'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('bases', function(table) {
            table.increments();
            table.string('name').notNullable();
            table.integer('user_id').references('id').inTable('users').notNullable();
            table.integer('level').defaultTo(1);
            table.timestamps();
        }),

        knex.schema.createTable('module_types', function(table) {
            table.increments();
            table.string('name').notNullable();
            table.text('description').notNullable();
            table.integer('personnel_slots_max').notNullable().defaultTo(0);
            table.string('build_requirements').notNullable();
        }),

        knex.schema.createTable('modules', function(table) {
            table.increments();
            table.integer('module_type_id').references('id').inTable('module_types').notNullable();
            table.integer('room_id').references('id').inTable('rooms');
            table.integer('level').notNullable().defaultTo(1);
            table.timestamps();
        }),

        knex.schema.createTable('rooms', function(table) {
            table.increments();
            table.integer('base_id').references('id').inTable('bases').notNullable();
            table.integer('module_id').references('id').inTable('modules');
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('rooms'),
        knex.schema.dropTable('modules'),
        knex.schema.dropTable('module_types'),
        knex.schema.dropTable('bases')
    ]);
};
