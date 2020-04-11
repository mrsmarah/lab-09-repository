'use strict';
const superagent = require('superagent');

function movieHandler(request, response){
    superagent(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${request.query.search_query}`
      )
      .then((movieResults) => {
          // console.log(movieResults); 
        const movieDataArr = movieResults.body.results.map((movieData) => {
          return new Movie(movieData);
        });
        response.status(200).json(movieDataArr);
      })
      .catch((err) => errorHandler(err, request, response));
  }

  
function Movie(movieData) {
    this.title = movieData.title;
    this.overview = movieData.overview;
    this.average_votes = movieData.vote_average;
    this.total_votes = movieData.vote_count;
    this.image_url =  `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
    this.popularity = movieData.popularity;
    this.released_on = movieData.release_date;
  }
  
  module.exports = movieHandler;