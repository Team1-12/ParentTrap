// Team 1-12 Chloe Cloud, John Gibson, Aaron Shaw, and Andrew Malone
// This is the source code for a baby planning website to bless the live of countless future parents
// Import express as express
let express = require('express');

let app = express(); // app is now an object of express type. App is variable of the whole website

let path = require('path'); // access to the path 

// lets you import your .env variables from config.js
const config = require('./config/config'); 

// Importing Users model used to run CRUD operations on db table for user table
const Users = require("./models/users");

let port = 5001

app.use(express.urlencoded( {extended: true} )) //determines how html is received from forms. This allows us to grab stuff out of the HTML form
// This is an object literal. Basically a dictionary



app.set("view engine", "ejs") //shows what view engine we are using 
app.set("views", path.join(__dirname, "../frontend/views")) //This is telling the server that we are going to start using certain views

app.use(express.urlencoded({extended: true})); //allows us to get data out of the request.body

// Serve static files from the 'CSS' directory
app.use('/CSS', express.static(path.join(__dirname, '../frontend/css')));

//goes to the landing page
app.get("/", (req, res) => {

    res.render("landingPage", {}); 
});
//goes to the login page
app.get("/login", (req, res) =>
{
    // no need to specify the extension because we already did in the view engine
    res.render("loginpage", {})
});

app.get("/signup", (req, res) =>
{
    res.render("signuppage", {})
});




// For this, db connection moved to db file, called in /models/users.js which is used here as Users.createUser
app.post("/signup", (req, res) => {
    Users.createUser(req.body) // Using Users model to insert new user
        .then(() => res.redirect("/"))
    });

app.get("/mileStone", (req, res) =>
    {
        knex('milestones')
            .select(
            'milestonetitle',
            'milestonedesription',
            'milestonedate'    
            )
            .then(milestone => {  
                res.render('index', { milestone });
            })
            .catch(error => {
                console.error('Error querying database:', error);
                res.status(500).send('Internal Server Error');
                });
    })  

// app listening
app.listen(port, () => console.log("Express App has started and server is listening!"));
