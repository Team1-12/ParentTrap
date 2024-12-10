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
app.get("/login", (req, res) =>
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
    const userid = req.session.userid; // Get the volunteerid from the session

    knex('milestones')
      .select(
        'milestoneid',
        'milestonetitle',
        'trimester',
        'milestonedate',
        'journal'
      )
      .where(userid, userid)
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


//Looks up the milestone and fetches data to put into the editMilestone page
app.get('/editMilestone/:milestoneid', isAuthenticated, (req, res) => {
    const milestoneid = req.params.milestoneid;
  
     //Query the Event by eventid
    knex('milestone')
      .where('milestoneid', milestoneid)
      .first()
      .then(milestone => {
        if (!milestone) {
          return res.status(404).send('Milestone not found');
        }
        res.render('editMilestone', { milestone }); // Pass the milestone data to the template
      })
      .catch(error => {
        console.error('Error fetching milestone for editing:', error);
        res.status(500).send('Internal Server Error');
      });
  });
  
// Post the updated milestone into the database
  app.post('/editMilestone/:milestoneid', isAuthenticated,(req, res) => {
    const userid = req.session.userid;
    const milestoneid = req.params.milestoneid;
  
        // Access each value directly from req.body
        const milestonetitle = req.body.milestonetitle;
    
        const trimester = req.body.trimester;
    
        const milestonedate = req.body.milestonedate;
    
        const journal = req.body.journal;
    
    
        // Update the milestone in the database
        knex('milestone')
          .where('milestoneid', milestoneid)
          .update({
            userid: userid,
            milestonetitle: milestonetitle.toLowerCase(),
            trimester: trimester.toLowerCase(),
            milestonedate: milestonedate,
            journal: journal,
          })
          .then(() => {
            res.redirect('/displayMileStone'); // Redirect to the list of Milestones after saving
          })
          .catch(error => {
            console.error('Error updating milestone:', error);
            res.status(500).send('Internal Server Error');
          });
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

// This will login the user and redirect them
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
      
        if (!username || !password) {
          return res.render('login', { error: 'Username and password are required.' });
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
              req.session.userid = user.userid; // Store volunteerid in the session
      
              req.session.save(err => {
                if (err) {
                  console.error('Session save error:', err);
                  return res.status(500).send('Internal Server Error');
                }
      
                // Redirect based on the user's role
                if (user.isAuthenticated === true) {
                  res.redirect('/displayMileStone'); // Redirect to milestone page
                } 
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






// app listening
app.listen(port, () => console.log("Express App has started and server is listening!"));
