//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;

var router = express.Router();

router.post("/leaveChat", (req, res) => {
    
    var chatId = req.body['chatId'];
    var username = req.body['username'];
    
    
    if(!chatId || !username) {
        res.send({
            success: false,
            error: "no chat Id or Username passed in to leaveChat"
        });
        return;
    }
    let leave =  `DELETE FROM chatmembers WHERE (memberid =
                (SELECT memberid FROM members WHERE username = $2)) AND
                (chatid = $1)`

    db.none(leave, [chatId, username])
    .then(() => {
        res.send({
            success: true,
            
        });
    }).catch((err) => {
        res.send({
            success: false,
            error: err,
        })
    });

});


router.post("/getMyChats", (req, res) => {
    var username = req.body['username'];
     
    if(!username) {
        res.send({
            success: false,
            error: "incorrect information"
        });
        return;
    }
    let list =  `SELECT Chats.chatid, Chats.name FROM Chats INNER JOIN ChatMembers ON Chats.chatid=ChatMembers.chatId WHERE memberid=(SELECT memberid FROM Members WHERE username=$1)`

    db.manyOrNone(list, username)
    .then((chats) => {
        res.send({
            chats
        })
    }).catch((err) => {
        res.send({
            success: false,
            error: err
        })
    });
});

router.get("/getMyChatsTwo", (req, res) => {
    var username = req.query['username'];
     
    if(!username) {
        res.send({
            success: false,
            error: "incorrect information"
        });
        return;
    }
    let list =  `SELECT Chats.chatid, Chats.name FROM Chats INNER JOIN ChatMembers ON Chats.chatid=ChatMembers.chatId WHERE memberid=(SELECT memberid FROM Members WHERE username=$1)`

    db.manyOrNone(list, username)
    .then((chats) => {
        res.send({
            chats
        })
    }).catch((err) => {
        res.send({
            success: false,
            error: err
        })
    });
});

module.exports = router;