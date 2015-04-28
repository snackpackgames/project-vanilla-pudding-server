'use strict';

var bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('users').del(), 

        // Inserts seed entries
        knex('users').insert({
            id: 1,
            first_name: "Brendon", 
            last_name: "Roberto", 
            email: "brendon@brendonroberto.com", 
            password_hash:bcrypt.hashSync(process.env.EXPRESS_ADMIN_PASSWORD, bcrypt.genSaltSync(10)), 
            created_at:new Date(), 
            updated_at: new Date() 
        })
    );
};
