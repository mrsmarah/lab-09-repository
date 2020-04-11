'use strict';
const superagent = require('superagent');

function trailsHandler(request, response) {
    superagent(
      `https://www.hikingproject.com/data/get-trails?lat=${request.query.latitude}&lon=${request.query.longitude}&maxDistance=4000&key=${process.env.TRAIL_API_KEY}`
      )
      .then((trailRes) => {
        const trailDataArr = trailRes.body.trails.map((trailData) => {
          return new Trail(trailData);
        });
        response.status(200).json(trailDataArr);
      })
      .catch((err) => errorHandler(err, request, response));
  }


  
function Trail(trailData) {
    this.name = trailData.name;
    this.location = trailData.location;
    this.length = trailData.length;
    this.stars = trailData.stars;
    this.stars_votes = trailData.starsVotes;
    this.summary = trailData.summary;
    this.trail_url = trailData.url;
    this.conditions = trailData.conditionDetails;
    this.condition_date = trailData.conditionDate.split(" ")[0];
    this.condition_time = trailData.conditionDate.split(" ")[1];
  }

  module.exports = trailsHandler;
