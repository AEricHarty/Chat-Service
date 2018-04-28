const pgp = require('pg-promise')();
//We have to set ssl usage to true for Heroku to accept our connection
pgp.pg.defaults.ssl = true;

//Create connection to Heroku Database
let db;
//Uncomment next line and change the string to your DATABASE_URL
db = pgp('postgres://newycxsgbbmpwm:c1b23e9a8c632ad27418a2f027bb8f881640a9e963a2cbe9ce177049072fe6ef@ec2-23-23-247-222.compute-1.amazonaws.com:5432/d1ac2hfig8lt7c');

if(!db) {
   console.log("SHAME! Follow the intructions and set your DATABASE_URL correctly");
   process.exit(1);
}

module.exports = db;