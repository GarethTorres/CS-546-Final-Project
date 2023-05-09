<<<<<<< Updated upstream
// Import required modules
import express from 'express';
import exphbs from 'express-handlebars';

// Create an instance of the express application
const app = express();

// Configure Handlebars as the view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Define routes
app.get('/', (req, res) => {
  // Render the homepage.handlebars template
  res.render('homepage');
});

app.get('/createshowcase', (req, res) => {
  // Render the createshowcase.handlebars template
  res.render('createshowcase');
});

app.get('/login', (req, res) => {
  // Render the login.handlebars template
  res.render('login');
});

app.get('/searchresults', (req, res) => {
  // Render the searchresults.handlebars template
  res.render('searchresults');
});

app.get('/showcase', (req, res) => {
  // Render the showcase.handlebars template
  res.render('showcase');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
=======
import express, { static as _static, json, urlencoded } from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.__filename = __filename;
global.__dirname = __dirname;

const app = express();
const a = _static(__dirname + "/public");

import session from 'express-session';
import cookieParser from 'cookie-parser';

import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";

app.use("/public", a);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(json());
app.use(
	session({
        name: 'AuthCookie',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: true,
        cookie: { 
        
    },
    })
);

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
>>>>>>> Stashed changes
