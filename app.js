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
