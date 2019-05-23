const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

console.log(__dirname);
console.log(path.join(__dirname, '../public'));

const app = express();
const port = process.env.PORT || 3000;   // Use PORT environment variable on Heroku or port 3000 locally

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');  // Configure directory to serve assets from
const viewsPath = path.join(__dirname, '../templates/views');  // Configure directory location of views
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up handlebars engine and views location
app.set('view engine', 'hbs');   // Use handlebars as the view engine for express
app.set('views', viewsPath);     // Tell Express to use the viewsPath configured above
hbs.registerPartials(partialsPath);

// Set up static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {         // Render the index view, pass in object
    title: 'Weather',
    name: 'Alex Perkins'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Alex Perkins'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    msg: 'Please please help me',
    title: 'Help',
    name: 'Alex Perkins'
  });
});

app.get('/weather', (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.send({
      error: 'You must provide an address.'
    });
  }


  geocode(address, (error, {latitude, longitude, location} = {}) => {
    if (error) {
      return res.send({ error });
    }
  
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error} );
      }
  
      res.send({
        forecast: forecastData,
        location,
        address
      });
    });
  });


});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term.'
    });
  }
  console.log(req.query);
  res.send({
    products: []
  });
});

// Custom 404 path for the help path
app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    msg404: 'Help article not found.',
    name: 'Alex Perkins'
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    msg404: 'Page not found.',
    name: 'Alex Perkins'
  });
});


app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
  
});