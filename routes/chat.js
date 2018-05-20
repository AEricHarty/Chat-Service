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
    var contactList = req.body['contacts']; // should be array of usernames
    
    
    if(!chatName || !username || !contactList) {
        res.send({
            success: false,
            error: "no chat name or Username passed in or no connections checked off to create multichat"
        });
        return;
    }
    let createChat =  `INSERT INTO Chats(name) 
                       VALUES($1)`

    db.none(createChat, [chatName])
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

    let addUser = `INSERT INTO Chatmembers(chatid, memberid) 
                    VALUES (SELECT chatid 
                    FROM Chats 
                    WHERE name = $1), 
                    (SELECT memberid 
                        FROM members 
                        WHERE username = $2)`
                   
    db.none(addMembers, [chatName, userName])
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

    var i;
    for (i = 0; i < contactList.length; i++) {
        var contact = contactList[i];

        let addToChat = `INSERT INTO Chatmembers(chatid, memberid) 
                    VALUES (SELECT chatid 
                    FROM Chats 
                    WHERE name = $1), 
                    (SELECT memberid 
                        FROM members 
                        WHERE username = $2)`
                   
        db.none(addToChat, [chatName, contactList[i]])
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

    }
    
});

router.get("/leaveChat", (req, res) => {
    let leaveName = req.query['username'];
    
    let query = `DELETE FROM chatmembers WHERE memberid = 
                (SELECT memberid FROM members WHERE username = $1)`
    db.manyOrNone(query, [leaveName])

    .then((rows) => {
        res.send({
            messages: rows
        })
    }).catch((err) => {
        res.send({
            success: false,
            error: err
        })
    });
});


module.exports = router;