//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;

var router = express.Router();


router.post("/addToChat", (req, res) => {
    
    var chatName = req.body['chatName'];
    var username = req.body['username'];
    
    
    if(!chatName || !username) {
        res.send({
            success: false,
            error: "no chat name or Username passed in to addtoChat"
        });
        return;
    }
    let add =  `INSERT INTO Chatmembers(chatid, memberid) 
                VALUES ((SELECT chatid 
                FROM Chats 
                WHERE name = $1), 
                (SELECT memberid 
                FROM members 
                WHERE username = $2))`

    db.none(add, [chatName, username])
    .then(() => {
        res.send({
            success: "success:  added to chat",
            
        });
    }).catch((err) => {
        res.send({
            success: "false: unable to add to chat",
            error: err,
        });
    });

});

module.exports = router;