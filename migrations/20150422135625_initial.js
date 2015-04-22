'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', function(table) {
            table.increments();
            table.string('first_name');
            table.string('last_name');
            table.string('email');
            table.string('password_hash');
            table.timestamps();
        }),

        knex.schema.createTable('actions', function(table) {
            table.increments();
            table.string('name');
            table.time('duration');
        }),
        
        knex.schema.createTable('transactions', function(table) {
            table.increments();
            table.integer('user_id').references('id').inTable('users');
            table.integer('action_id').references('id').inTable('actions');
            table.boolean('complete');
            table.timestamps();
        }),

        knex.schema.createTable('personnel_types', function(table) {
            table.increments();
            table.string('name');
            table.text('description');
            table.integer('base_power');
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
