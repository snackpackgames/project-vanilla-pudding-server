'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', function(table) {
            table.increments();
            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.string('email').notNullable().unique();
            table.string('password_hash').notNullable();
            table.timestamps();
        }),

        knex.schema.createTable('actions', function(table) {
            table.increments();
            table.string('name').notNullable().unique();
            table.integer('duration').defaultTo(0);
        }),
        
        knex.schema.createTable('transactions', function(table) {
            table.increments();
            table.integer('user_id').references('id').inTable('users').notNullable();
            table.integer('action_id').references('id').inTable('actions').notNullable();
            table.boolean('complete').notNullable().defaultTo(false);
            table.timestamps();
        }),

        knex.schema.createTable('personnel_types', function(table) {
            table.increments();
            table.string('name').notNullable();
            table.text('description').notNullable();
            table.integer('base_power').notNullable();
        }),

        knex.schema.createTable('personnel', function(table) {
            table.increments();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('actions'),
        knex.schema.dropTable('transactions'),
        knex.schema.dropTable('personnel_types'),
        knex.schema.dropTable('personnel')
    ]);
};
