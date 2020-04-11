
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect().then();


function locationHandler(request, response) {
  //GET data from DATABASE(if any)
  const city = request.query.city;
  const SQL = 'SELECT * FROM location WHERE search_query = $1';
  const values = [city];
  client.query(SQL,values).then((results) => {
      if (results.rows.length > 0){
        response.status(200).json(results.rows[0]);
      }else{
        superagent(
          `https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${request.query.city}&format=json`
      ).then((res) =>{
          const geoData = res.body;
          // GET data from QUERY & INSERT it to the DATABASE
          const locationData = new Location(city, geoData);
          const SQL = 'INSERT INTO location(search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4) RETURNING *';
          const safeValues = [locationData.search_query, locationData.formatted_query, locationData. latitude, locationData.longitude];
          client.query(SQL, safeValues).then((results) => {
            response.status(200).json(results.rows[0]);
            });
      });
    }
    })
    .catch((err) => errorHandler(err, request, response));
  }

  function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
  }
  
  module.exports = locationHandler;


// function locationHandler(request, response) {
//     const city = request.query.city;
//     getLocationData(city)
//     .then(results => response.status(200).json(results))
//     .catch((error) =>handler.errorHandler(error, request, response));
//     }
  
//     function getLocationData(city) {
//         let SQL = 'SELECT * FROM locations WHERE search_query = $1';
//         let values = [city];
//         return client.query(SQL, values).then(results => {
//             if (results.rowCount) { 
//                 return results.rows[0];
//              } else {
//               let key = process.env.GEOCODE_API_KEY;
//               const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
//               return superagent.get(url)
//                 .then(results => cacheLocation(city, results.body));
//             }
//           });
//       }

//       function cacheLocation(city, results) {
//         const locationData = new Location(geoData[0]);
//         let SQL = `INSERT INTO locations (search_query, formatted_query, latitude, longitude)
//           VALUES ($1, $2, $3, $4) RETURNING *`;
//         let values = [city, location.formatted_query, location.latitude, location.longitude];
//         return client.query(SQL, values).then(results => 
//             results.rows[0]);
//       }

   