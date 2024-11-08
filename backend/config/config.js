// This file exports an object containing configuration settings from the .env file, making them available to entire app.
// This file helps keep sensitive information secure and easily accessible.
// Everyone will have the same exact config file, only hidden .env info changes

// IMPORT .env
// Imports the .env file and loads environment variables from .env
require('dotenv').config(); 

// CODE BELOW:
// module.exports creates an object.
// The config object has properties like config.port and config.db, allowing easy access to .env settings/variables:
// - config.port gives access to the application's port number from .env.
// - config.db is an object with nested properties (host, user, password, name) for database configuration. 
//      - EX. After file requires(config.js)(see below) it can access port number with 'config.port', 
//            or database password with 'config.db.password' >> console.log(config.db.password) will print pw from .env
module.exports = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
};

// TO REQUIRE/IMPORT config.js into another file, ex. into index.js use code below: 
// const config = require('./config/config'); - then you can use 'config.db.password' or config.anythingIntheConfig to get info
