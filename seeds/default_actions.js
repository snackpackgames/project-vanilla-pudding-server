'use strict';

exports.seed = function(knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('actions').del(), 

        // Inserts seed entries
        knex('actions').insert({id: 1, name: 'ACTION_UPDATE_RESOURCE'}),
        knex('actions').insert({id: 2, name: 'ACTION_START_RESOURCE_COUNTDOWN'}),
    );
};
