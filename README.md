# ParentTrap

Mission Statement: As BYU alumni, we have frequently witnessed married students struggling to navigate college life and parenthood. We intend to 
help those families learn how to solve common problems that arise early on. These range from budgeting to basic baby care. 

Description: This application will help new or soon-to-be parents prepare for the challenges of starting a family.

# Features:
  - Page for budgeting
  - Basic baby care tips
  - Common items needed
  - Baby milestones
  - Support Groups
  - Advice from other new parents
 

# Directories:
  IN-BACKEND
  - Config: Contains config.js, which loads environment variables from the .env file and makes them accessible throughout the application
  - Controllers: Contains files that handle the logic for each route or feature in the application. (database updates etc.) index.js connects frontend to controllers 
  - DB: Contains db.js, which manages the database connection setup. ex. in db.js, one funtion connects to entire db, another runs a query and lets you use queried data 
  - Models: Contains files that use models to recreate the structure a db table(columns) by making an object. Model objects can be imported into other files and have method that
            let you do CRUD operations in those other .js files
  - Index.js: The main entry point for the backend server. It initializes the Express application, sets up routes, and starts the server.
  
  IN-FRONTEND
  - CSS: contains css files
  - JS: Contains client-side .js files used for adding funtionality to the frontend, such as handling button clicks, form validation, or updating content dynamically
  - Images: pictures
  - Views: Contains EJS templates used to render dynamic content on the frontend. Each .ejs file represents a different page in the application, which is served to the client by the backend.

# frontend .js files VS. backend index.js AND controller .js files
    - Frontend .js file: Handles tasks that don’t require interaction with the server (client-side logic - form validation, hide/show, UI interactivity)
                         Frontend JavaScript can control the behavior of UI elements, such as showing/hiding elements, handling button clicks, or providing animations.
                         Othewise, you would have to call the backend to do simple tasks
                         It can validate form fields (like checking if an email is in the correct format) before sending data to the server, immediate feedback.

    - Backend : Routes: Define endpoints and HTTP methods, deciding what happens when a specific URL is accessed. (Delegate the actual request handling logic to controllers.)

                Controllers: Handle the logic for each route. Controllers separate business logic (like fetching data, applying calculations, 
                             or validating input) from the routing. Interact with models (database) 
                             Return responses to the client (e.g., success messages, data, or errors).

# Scripts:
    New Commands: npm start - shortcut to start server, also useful when uploading to AWS
                  npm run dev  - starts a dev server session, this allows server to automatically restart when you 
                                  make file changes so you do not have to stop and re-start, only used in development
                  npm install - in root will automatically install recently added dependan