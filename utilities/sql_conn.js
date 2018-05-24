const pgp = require('pg-promise')();
//We have to set ssl usage to true for Heroku to accept our connection
pgp.pg.defaults.ssl = true;

//Create connection to Heroku Database
const db = pgp('postgres://qbchbxubahnjag:ce59d95bf5bf0ae342127c203de81797f0d22572b74157062c8799525b8db035@ec2-174-129-41-64.compute-1.amazonaws.com:5432/d9lb6gviv2jj60');
//const db = pgp(process.env.DATABASE_URL);

if(!db) {
   process.exit(1);
}

module.exports = db;