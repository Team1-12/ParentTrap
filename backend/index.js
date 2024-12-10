// Team 1-12 Chloe Cloud, John Gibson, Aaron Shaw, and Andrew Malone
// This is the source code for a baby planning website to bless the live of countless future parents
// Import express as express
let express = require('express');
let app = express(); 
let path = require('path');

const Users = require("./models/users");
const config = require('./config/config'); 
const port = process.env.PORT || 5001

const session = require('express-session'); 


// Session middleware setup
app.use(session({
    secret: '123456789', // Replace with a secure secret key
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 60 minutes
  }));


const knex = require("knex") ({
    client : "pg",
    connection : {
        host : process.env.RDS_HOSTNAME || "awseb-e-ygbwfxmnac-stack-awsebrdsdatabase-nwarovbddchx.cna8yiecw5c6.us-east-1.rds.amazonaws.com",
        user : process.env.RDS_USERNAME || "babydata",
        password : process.env.RDS_PASSWORD || "splishsplash",
        database : process.env.RDS_DB_NAME || "ebdb",
        port : process.env.RDS_PORT || 5432,
        ssl: {rejectUnauthorized: false}
    }
  });
app.use(express.urlencoded( {extended: true} )) //determines how html is received from forms. This allows us to grab stuff out of the HTML form
// This is an object literal. Basically a dictionary


app.set("view engine", "ejs") //shows what view engine we are using 
app.set("views", path.join(__dirname, "../frontend/views")) //This is telling the server that we are going to start using certain views

app.use(express.urlencoded({extended: true})); //allows us to get data out of the request.body

// Serve static files from the 'css' directory
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));

//goes to the landing page
app.get("/", (req, res) => {

    res.render("index", {}); 
});
//goes to the login page
app.get("/loginpage", (req, res) =>
{
    // no need to specify the extension because we already did in the view engine
    res.render("loginpage", {})
});

app.get("/signup", (req, res) =>
{
    res.render("signuppage", {})
});

//goes to the home page
app.get("/homepage", (req, res) => {

    res.render("homepage", {}); 
});

//goes to the home page
app.get("/mileStone", (req, res) => {

    res.render("mileStone", {}); 
});


//Route to display milestone records 
app.get('/displayMileStone', (req, res) => {
    knex('milestones')
      .select(
        'milestoneid',
        'milestonetitle',
        'trimester',
        'milestonedate',
        'journal'
      )
      .then(milestones => {
        // Render the displayMileStone.ejs template and pass the data
        res.render('displayMileStone', { milestones });
      })
      // Memorize or paste in to the end of all 
      .catch(error => {
        console.error('Error querying database:', error);
        res.status(500).send('Internal Server Error');
      });
  });
  
  // this chunk of code finds the record with the primary key aka id and deletes the record
  app.post('/deleteMileStone/:milestoneid', (req, res) => {

    const milestoneid = req.params.id;

    knex('milestones')
      .where('milestoneid', milestoneid)
      .del() // Deletes the record with the specified ID
      .then(() => {
        res.redirect('/displayMileStone'); // Redirect to the milestone list after deletion
      })
      .catch(error => {
        console.error('Error deleting Pokémon:', error);
        res.status(500).send('Internal Server Error');
      });
  });   


//goes to the record edit page
app.get("/editMileStone", (req, res) => {

    res.render("editMileStone", {}); 
});



// For this, db connection moved to db file, called in /models/users.js which is used here as Users.createUser
app.post("/signup", (req, res) => {
    Users.createUser(req.body) // Using Users model to insert new user
        .then(() => res.redirect("./homepage")).catch(error => {
            console.error('Error inserting data:', error);
            res.status(500).send('Internal Server Error');
          });
    });


// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
      // User is authenticated, proceed to the next middleware
      return next();
    } else {
      // User is not authenticated, redirect to login page
      res.redirect('/login');
    }
  }

// ----------- LOGIN -----------

app.get('/login', (req, res) => {
    // Check if the user is already authenticated
    if (req.session && req.session.isAuthenticated) {
    
    return res.redirect('/displayMileStone');

    }
  
    // If not authenticated, render the login page
    res.render('login');
  });

// This will login the user and redirect them
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
      
        if (!username || !password) {
          return res.render('loginpage', { error: 'Username and password are required.' });
        }
      
        // Query the database to check if the username and password exist
        knex('security')
          .select('*')
          .where({ username, password }) // Note: Storing plaintext passwords is insecure
          .first()
          .then(user => {
            if (user) {
              // Set session variables
              req.session.isAuthenticated = true;
      
              req.session.save(err => {
                if (err) {
                  console.error('Session save error:', err);
                  return res.status(500).send('Internal Server Error');
                }
      
                // Redirect to a common landing page after login
                res.redirect('/displayMileStone');
              });
            } else {
              // Render login page with error if invalid credentials
              res.render('login', { error: 'Invalid username or password.' });
            }
          })
          .catch(err => {
            console.error('Database error:', err);
            res.status(500).send('Internal Server Error');
          });
      });

// Logout endpoint
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Failed to log out. Please try again.');
      }
      // Redirect to home page or login page after logout
      res.redirect('/login'); // Or replace with '/' if you want to redirect to the homepage
    });
  });
// ---------------------

// app listening
app.listen(port, () => console.log("Express App has started and server is listening!"));
