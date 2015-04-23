# project-vanilla-pudding-server
Node.js api server for project-vanilla-pudding

## Getting Started

1. `npm install` to install all dependencies.
2. Create a shell script to store your secret keys. If you call it `secret.sh` then `env.sh` will automatically source it when it runs. You'll need to define the following variables:
    * `EXPRESS_SECRET_KEY`
3. `source env.sh` to set up your dev environment -- **IMPORTANT** the server won't run unless environment variables are set correctly, so sourcing this script is required.
    * Remember to add the filename of your secrets file if you're not using secret.sh.
4. `npm install knex -g` (/w `sudo` if needed) to install the knex cmd-line client
5. `knex migrate:latest` to migrate to the latest version of the database

[more steps coming soon]
