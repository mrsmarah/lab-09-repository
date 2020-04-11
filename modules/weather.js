'use strict';
const superagent = require('superagent');

function weatherHandler(request, response) {
    superagent(
      `https://api.weatherbit.io/v2.0/forecast/daily?city=${request.query.search_query}&key=${process.env.WEATHER_API_KEY}`
      )
      .then((skyData) => {
        // console.log(skyData); 
        const weatherDataArr = skyData.body.data.map((day) => {
          return new Weather(day);
        });
        response.status(200).json(weatherDataArr);
      })
      .catch((err) => errorHandler(err, request, response));
  }

  
function Weather(skyData) {
    this.forecast = skyData.weather.description;
    this.time = new Date(skyData.valid_date).toDateString();
  }

  module.exports = weatherHandler;
