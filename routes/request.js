//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;

var router = express.Router();

router.post("/sendRequest", (req, res) => {
    let username = req.body['username'];
    let connection = req.body['connection'];
    
    if(!username || !connection) {
        res.send({
            success: false,
            error: "Username or newConnectionName not supplied"
        });
        return;
    }
    /*
    let insert = `INSERT INTO Messages(ChatId, Message, MemberId)
                  SELECT $1, $2, MemberId FROM Members
                  WHERE Username=$3`
    db.none(insert, [chatId, message, username]) */              
                  
    /*
    let insert1 = `INSERT INTO contacts(memberid_a, memberid_b, verified) 
                   VALUES(2, 32, 0)`
    */     

    /*
    let insert1 = `INSERT INTO contacts (memberid_a, memberid_b, verified) 
                   VALUES ((SELECT memberid 
                            FROM members 
                            WHERE username LIKE $1), 
                           (SELECT memberid 
                            FROM members 
                            WHERE username LIKE $2),
                            0)`
                  */          

    let insert1 = `INSERT INTO contacts(memberid_a, memberid_b, verified) 
                    VALUES ((SELECT memberid 
                    FROM members 
                    WHERE username = $1), 
                    (SELECT memberid 
                        FROM members 
                        WHERE username = $2),
                    0);`
                   
    db.none(insert1, [username, connection])
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