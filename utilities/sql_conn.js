const pgp = require('pg-promise')();
//We have to set ssl usage to true for Heroku to accept our connection
pgp.pg.defaults.ssl = true;

//Create connection to Heroku Database
let db;
//Uncomment next line and change the string to your DATABASE_URL
db = pgp('postgres://qbchbxubahnjag:ce59d95bf5bf0ae342127c203de81797f0d22572b74157062c8799525b8db035@ec2-174-129-41-64.compute-1.amazonaws.com:5432/d9lb6gviv2jj60');

if(!db) {
   console.log("SHAME! Follow the intructions and set your DATABASE_URL correctly");
   process.exit(1);
}

module.exports = db;