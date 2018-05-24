//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;
 
var router = express.Router();
 
router.post("/createChat", (req, res) => {
    var chatName = req.body['chatName'];
    var username = req.body['username'];
    var contactList = req.body['checkbox']; // should be array of usernames
 
    console.log("List is " + contactList[0] + " " + contactList[1]);
 
   
    if(!chatName || !username || !contactList) {
        res.send({
            success: false,
            error: "no chat name or Username passed in or no connections checked off to create multichat"
        });
       
    }
    let createChat =  `INSERT INTO Chats(name)
                       VALUES($1)`
 
    db.none(createChat, [chatName])
    .then(() => {
        console.log("Chat created successfully");
        let addUser = `INSERT INTO Chatmembers(chatid, memberid)
                    VALUES ((SELECT chatid
                    FROM Chats
                    WHERE name = $1),
                    (SELECT memberid
                    FROM members
                    WHERE username = $2))`
                   
        db.none(addUser, [chatName, username])
        .then(() => {
            console.log("Added user " + username + " successfuly");
            var i;
            for (i = 0; i < contactList.length; i++) {
                var contact = contactList[i];
                console.log(contact);
                let addToChat = `INSERT INTO Chatmembers(chatid, memberid)
                            VALUES ((SELECT chatid
                            FROM Chats
                            WHERE name = $1),
                            (SELECT memberid
                                FROM members
                                WHERE username = $2))`
                       
                db.none(addToChat, [chatName, contactList[i]])
                .catch((err) => {
                    res.send({
                        success: false,
                        message: "" + contactList[i] + " not added to chat",
                        error: err
                    });
                });
            }
        }).catch((err) => {
            res.send({
                success: false,
                message: "" + username +" not added to chat",
                error: err
            });
        });
    }).catch((err) => {
        res.send({
            success: false,
            message: "Chat creation failed",
            error: err
        });
    });
   
   
});
 
module.exports = router;


/*
//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;

var router = express.Router();

router.post("/createChat", (req, res) => {
    var chatName = req.body['chatName'];
    var username = req.body['username'];
    var contactList = req.body['checkbox']; // should be array of usernames
    console.log(contactList[0]);
    console.log(contactList[1]);
    
    if(!chatName || !username || !contactList) {
        res.send({
            success: false,
            error: "no chat name or Username passed in or no connections checked off to create multichat"
        });
        
    }
    let createChat =  `INSERT INTO Chats(name) 
                       VALUES($1)`

    db.none(createChat, [chatName])
    .then(() => {
        res.send({
            success: "success: chat created"
            
        });
    }).catch((err) => {
        res.send({
            success: "false: chat creation failed",
            error: err
        });
    });
    
    let addUser = `INSERT INTO Chatmembers(chatid, memberid) 
                    VALUES ((SELECT chatid 
                    FROM Chats 
                    WHERE name = $1),
                    (SELECT memberid 
                    FROM members 
                    WHERE username = $2))`
                   
    db.none(addUser, [chatName, username])
    .then(() => {
        res.send({
            success: "success, username added to chat"
        });
    }).catch((err) => {
        res.send({
            success: "false: username not added to chat",
            error: err
        });
    });

    let addToChat = `INSERT INTO Chatmembers(chatid, memberid) 
                    VALUES ((SELECT chatid 
                    FROM chats 
                    WHERE name = $1), 
                    (SELECT memberid 
                        FROM members 
                        WHERE username = $2))`
    var i;
    for (i = 0; i < 2; i++) {
        var contact = contactList[i];
                   
        db.none(addToChat, [chatName, contact])
        
        .then(() => {
            res.send({
                success: "success added contacts to chat"
            });
            
        }).catch((err) => {
            res.send({
                success: "false: contacts not added to chat",
                error: err
            });
        });

    }
    
});

module.exports = router;
*/