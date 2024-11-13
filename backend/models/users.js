// This is an example of a model for a user table in the db. This allows us to create a Users object that has prewritten CRUD operations that can be called into index.js
const db = require("../db/db");

const Users = {
    verifyUser: null , // this would be called when logging in to verify user
    getUserById: (id) => db("users").where({ id }).first(),

    // When called, createUser pulls the information from the new user form (or any form that points to it) and inserts it into the users table.
    // EX. Could also create an admin page that that lets you create or edit a user using this same createUser function
    createUser: (userData) => db("users").insert(userData).returning("*"),
    // Add other user-related queries here
};

module.exports = Users;
