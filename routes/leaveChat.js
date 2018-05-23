//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;

var router = express.Router();

router.post("/leaveChat", (req, res) => {
    
    var chatName = req.body['chatName'];
    var username = req.body['username'];
    
    
    if(!chatName || !username) {
        res.send({
            success: false,
            error: "no chat name or Username passed in to leaveChat"
        });
        return;
    }
    let leave =  `DELETE FROM chatmembers WHERE (memberid =
                (SELECT memberid FROM members WHERE username = $2)) AND
                (chatid = (SELECT chatid FROM chats WHERE name = $1))`

    db.none(leave, [chatName, username])
    .then(() => {
        res.send({
            success: "success:  left chat",
            
        });
    }).catch((err) => {
        res.send({
            success: "false: unable to leave chat",
            error: err,
        });
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
    //Need a query that gets every chatid associated with the username from chatmembers
    // and joins with the chats table to return every row with a chat the user is in
    let list =  `DELETE FROM chatmembers WHERE (memberid =
                (SELECT memberid FROM members WHERE username = $2)) AND
                (chatid = (SELECT chatid FROM chats WHERE name = $1))`

    db.manyOrNone(list, username)
    .then((rows) => {
        res.send({
            rows
        })
    }).catch((err) => {
        res.send({
            success: false,
            error: err
        })
    });
});

module.exports = router;