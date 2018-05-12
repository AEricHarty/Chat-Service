//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;

var router = express.Router();

router.post("/sendRequest", (req, res) => {
    let username = req.body['memberid_a'];
    let connection = req.body['memberid_b'];
    let verified = req.body['verified'];
    if(!username || !connection || !verified) {
        res.send({
            success: false,
            error: "Username, connectionName, or verification not supplied"
        });
        return;
    }
    /*
    let insert = `INSERT INTO Messages(ChatId, Message, MemberId)
                  SELECT $1, $2, MemberId FROM Members
                  WHERE Username=$3`
    db.none(insert, [chatId, message, username]) */              
                  
    /*
    let insert1 = `INSERT INTO contacts (memberid_a, memberid_b, verified) 
                   values (1, (SELECT memberid FROM members WHERE username=$1)), 
                   (2, (SELECT memberid FROM members WHERE username=$1)),
                   (3, #3)`
                   */
    let insert1 = `INSERT INTO contacts(memberid_a, memberid_b, verified) 
                   VALUES(10, 20, 0)`
    db.none(insert1, [username, connection, verified])
    .then(() => {
        res.send({
            success: true
        });
    }).catch((err) => {
        res.send({
            success: false,
            error: err,
        });
    });
    
});
module.exports = router;