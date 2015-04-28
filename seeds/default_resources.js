'use strict';

exports.seed = function(knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('resource_types').del(), 
        knex('resources').del(),

        // Inserts seed entries
        knex('resource_types').insert({
            id: 1,
            name: "Energy",
            description: "Used to power the space station",
            exchange_rate: 1.0
        }),

        knex('resource_types').insert({
            id: 2,
            name: "Oxygen",
            description: "Required for crew members to breathe",
            exchange_rate: 0.5
        }),

        knex('resources').insert({
            id: 1,
            value: 0,
            user_id: 1,
            resource_type_id: 1,
            created_at: new Date(),
            updated_at: new Date()
        }),

        knex('resources').insert({
            id: 2,
            value: 0,
            user_id: 1,
            resource_type_id: 2,
            created_at: new Date(),
            updated_at: new Date()
        })
    );
};
