'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('modules'),
        knex.schema.dropTable('module_types'),
        knex.schema.dropTable('rooms'),
        knex.schema.createTable('structure_types', function(table) {
            table.increments();
            table.string('name').notNullable();
            table.text('description').notNullable();
            table.integer('personnel_slots_max').notNullable().defaultTo(0);
            table.string('build_requirements').notNullable();
        }),
        knex.schema.createTable('structures', function(table) {
            table.increments();
            table.integer('structure_type_id').references('id').inTable('structure_types').notNullable();
            table.integer('room_id').references('id').inTable('rooms');
            table.integer('level').notNullable().defaultTo(1);
            table.timestamps();
        }),
        knex.schema.createTable('rooms', function(table) {
            table.increments();
            table.integer('base_id').references('id').inTable('bases').notNullable();
            table.integer('structure_id').references('id').inTable('structures');
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('structures'),
        knex.schema.dropTable('structure_types'),
        knex.schema.dropTable('rooms'),
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
