//Get the connection to Heroku Database
const db = require('./sql_conn.js');


//We use this create the SHA256 hash

const crypto = require("crypto");
const FormData = require("form-data");
let sendGridAPIKey = process.env.EMAIL_API_KEY;
function sendEmail(from, to, subject, message) {
    var helper = require('sendgrid').mail;
    var from_email = new helper.Email(from);
    var to_email = new helper.Email(to);
    var subject = subject;
    var content = new helper.Content('text/plain', message);
    var mail = new helper.Mail(from_email, subject, to_email, content);
    
    var sg = require('sendgrid')(sendGridAPIKey);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
    
    sg.API(request, function(error, response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });

}

/**
* Method to get a salted hash.
* We put this in its own method to keep consistency
* @param {string} pw the password to hash
* @param {string} salt the salt to use when hashing
*/
function getHash(pw, salt) {
    return crypto.createHash("sha256").update(pw + salt).digest("hex");
}

function generateVerificationCode() {
    return Math.ceil(Math.random()*10000);
}

module.exports = {
    db, getHash, sendEmail, generateVerificationCode
};