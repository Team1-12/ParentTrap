// backend/db/db.js
// This file holds the database connection info. This is imported into the models files and will no longer need to be called in the index.js files
const knex = require("knex");
const config = require("../config/config");

const db = knex({
    client: "pg",
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
        port: config.db.port,
    },
});

module.exports = db;  // Export the db instance to use in other files