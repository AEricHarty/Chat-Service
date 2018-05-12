//express is the framework we're going to use to handle requests
const express = require('express');

const bodyParser = require("body-parser");

//Create connection to Heroku Database
let db = require('../utilities/utils').db;
                    
var router = express.Router();
router.use(bodyParser.json());

//used to request all incoming connections.
router.get("/", (req, res) => {

    let clientUsername = req.query['username'];

    if(!clientUsername) {
        res.send({
            success: false,
            error: "Username not supplied"
        });
        return;
    }

    let query =`SELECT Members.username
                FROM Contacts INNER JOIN 
                Members ON Members.memberid = Contacts.memberid_a
                WHERE Contacts.memberid_b = 
                   (SELECT Members.memberid 
                    FROM Members
                    WHERE Members.username = $1`
    db.manyOrNone(query,[clientUsername])
    .then((rows) => {
        res.send({
            incomming: rows
        })
    }).catch((err) => {
        res.send({
            success: false,
            error: err
        })
    });
});

router.post("/", (req, res) => {
    let clientUsername = req.body['username'];
    let otherUsername = req.body['otherUsername'];
    let decision = req.body['answer'];
    
    if(!clientUsername || !otherUsername || !decision) {
        res.send({
            success: false,
            error: "Your username OR their username OR answer not supplied"
        });
        return;
    }

    if(decision) {
        let query ='UPDATE Contacts SET verified =1 WHERE memberid_a = $2 AND memberid_b = $1'
        db.none(query, [clientUsername, otherUsername])
        .then((rows) => {
            res.send({
                success: true
            })
        }).catch((err) =>{
            res.send({
                success: false,
                error: err
            })
        });
    } else {
        let query = 'DELETE FROM Contacts WHERE memberid_a = $1 AND memberid_b = $2'
        db.none(query, [clientUsername, otherUsername])
        .then((rows) => {
            res.send({
                success: true
            })
        }).catch((err) =>{
            res.send({
                success: false,
                error: err
            })
        });
    }
});

module.exports = router;
