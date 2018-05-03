//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();

const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());

//Create connection to Heroku Database
let db = require('../utilities/utils').db;

let getVerificationCode = require('..utilities/utils').generateVerificationCode;

var router = express.Router();

router.post('/', (req, res) => {
    res.type("application/json");
    var username = req.body['username'];
    var email = req.body['email'];
    var code = req.body['code'];

    if(username && email && code) {
        let params = [username, email, code];

        //Using the 'one' method means that only one row should be returned
        db.one('SELECT VerificationCode FROM Members WHERE username=$1 AND email=$2 AND VerificationCode=$3', params)
        //If successful, run function passed into .then()
        .then(() => {
            db.none('UPDATE Members SET Verification=1 WHERE username=$1 AND email=$2 AND VerificationCode=$3', params)
            .then(() => {
                res.send({
                    success: true,
                    message: 'Your account is now verified.'
                });
            }).catch((err) => {
                res.send({
                    success: false,
                    message: err
                });
            });
        })
        //More than one row shouldn't be found, since table has constraint on it
        .catch((err) => {
            //If anything happened, it wasn't successful
            res.send({
                success: false,
                message: err
            });
        });
    } else {
        res.send({
            success: false,
            message: 'Verification code is incorrect.'
        });
    }
});

module.exports = router;