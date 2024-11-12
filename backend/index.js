// Team 1-12 Chloe Cloud, John Gibson, Aaron Shaw, and Andrew Malone
// This is the source code for a baby planning website to bless the live of countless future parents
// Import express as express
let express = require('express');

let app = express(); // app is now an object of express type. App is variable of the whole website

let path = require('path'); // access to the path 

let port = 5001

app.use(express.urlencoded( {extended: true} )) //determines how html is received from forms. This allows us to grab stuff out of the HTML form
// This is an object literal. Basically a dictionary

//Allows us to grab data from Postgress
const knex = require("knex") ({
    client : "pg",
    connection : {
        host : "localhost",
        user : "postgres",
        password : "", //Fill in - dynamically?
        database : "", //Fill in - dynamically?
        port : 5432
    }
})

app.set("view engine", "ejs") //shows what view engine we are using 
app.set("views", path.join(__dirname, "views")) //This is telling the server that we are going to start using certain views

app.use(express.urlencoded({extended: true})); //allows us to get data out of the request.body

//goes to the login page
app.get("/login", (req, res) =>
{
    // no need to specify the extension because we already did in the view engine
    res.render("loginpage", {})
});
// app listening
app.listen(port, () => console.log("Express App has started and server is listening!"));
