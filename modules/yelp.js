'use strict';
const superagent = require('superagent');

function yelpHandler(request, response){
    superagent(
      `https://api.yelp.com/v3/businesses/search?location=${request.query.city}`
      )
      .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
      .then((yelpResults) => {
          // console.log(yelpResults); 
        const yelpDataArr = yelpResults.body.businesses.map((yelpData) => {
          return new Yelp(yelpData);
        });
        response.status(200).json(yelpDataArr);
      })
      .catch((err) => errorHandler(err, request, response));
  }

  
function Yelp(yelpData) {
    this.name = yelpData.name;
    this.image_url = yelpData.image_url;
    this.price = yelpData.price;
    this.rating = yelpData.rating;
    this.url = yelpData.url;
  }
  
  module.exports = yelpHandler; 
  