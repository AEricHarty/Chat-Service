const pgp = require('pg-promise')();
//We have to set ssl usage to true for Heroku to accept our connection
pgp.pg.defaults.ssl = true;

//Create connection to Heroku Database
let db;
const db = pgp(process.env.DATABASE_URL);

if(!db) {
   console.log("SHAME! Follow the intructions and set your DATABASE_URL correctly");
   process.exit(1);
}

module.exports = db;