'use strict';

// Load Environment Variables from (.env) file:
require('dotenv').config();

// Application Dependencies:
const express = require('express');
const pg = require('pg');
const cors = require('cors');
const superagent = require('superagent');

// Application Setup:
const PORT = process.env.PORT || 4000;
const app = express(); //creating the server, waiting for the app.listen
const client = new pg.Client(process.env.DATABASE_URL);// CONNECT (DB) to the (psql) using url
app.use(cors());//will respond to any request


// Require Handlers:
const locationHandler = require('./modules/location.js');
const weatherHandler = require('./modules/weather.js');
const trailsHandler = require('./modules/trails.js');
const movieHandler = require('./modules/movies.js');
const yelpHandler = require('./modules/yelp.js');



// Route Definitions
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', trailsHandler);
app.get('/movies', movieHandler);
app.get('/yelp', yelpHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);
app.get('/', (request, response) => {// API Main Route:
  response.status(200).send('Home Page!');
});


// Error Handlers:
function notFoundHandler(request, response) {
  response.status(404).send('NOT FOUND!!');
}
function errorHandler(error, request, response) {
  response.status(500).send(error);
}


//Server is listening for requests ///IF NO ERRORS/// :
client.connect().then(() => {
    app.listen(PORT, () =>
      console.log(`my server is up and running on port ${PORT}`)
    );
  })
  .catch((err) => {
    throw new Error(`startup error ${err}`);
  });
  