//express is the framework we're going to use to handle requests
const express = require('express');

const bodyParser = require("body-parser");

//Create connection to Heroku Database
let db = require('../utilities/utils').db;
                    
var router = express.Router();
router.use(bodyParser.json());

//used to request all incoming connections.
router.get("/incoming", (req, res) => {

    let clientUsername = req.query['username'];

    let query =`SELECT Members.firstname, Members.lastname, Members.username, Members.email
                FROM Contacts INNER JOIN 
                Members ON Members.memberid = Contacts.memberid_a
                WHERE Contacts.verified = 0 AND 
                    Contacts.memberid_b = 
                    (SELECT Members.memberid 
                    FROM Members
                    WHERE Members.username = $1)`
    db.manyOrNone(query,[clientUsername])
    .then((rows) => {
        res.send({
            username: clientUsername,
            incomming: rows
        })
    }).catch((err) => {
        res.send({
            success: false,
            error: err
        })
    });
});

//used to respond to incoming connection request.
router.post("/incoming", (req, res) => {
    let clientUsername = req.body['username'];
    let otherUsername = req.body['otherUsername'];
    let decision = req.body['answer'];

    if(decision) {
        // confirm request = update Contacts.verified to true.
        let query ='UPDATE Contacts SET verified =1 WHERE memberid_a = (SELECT memberid FROM Members WHERE username = $2) AND memberid_b = (SELECT memberid FROM Members WHERE username = $1)'
        db.none(query, [clientUsername, otherUsername])
        .then(() => {
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
        //deny request = remove from database.
        let query = 'DELETE FROM Contacts WHERE memberid_a = (SELECT memberid FROM Members WHERE username=$2) AND memberid_b = (SELECT memberid FROM Members WHERE username=$1)'
        db.none(query, [clientUsername, otherUsername])
        .then((rws) => {
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

//used to request all outgoing connections.
router.get("/outgoing", (req, res) => {

    let clientUsername = req.query['username'];

    let query =`SELECT Members.firstname, Members.lastname, Members.username, Members.email
                FROM Contacts INNER JOIN 
                Members ON Members.memberid = Contacts.memberid_b
                WHERE Contacts.verified = 0 AND 
                    Contacts.memberid_a = 
                   (SELECT Members.memberid 
                    FROM Members
                    WHERE Members.username = $1)`
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

//used to cancel an outgoing connection request.
router.post("/outgoing", (req, res) => {
    let clientUsername = req.body['username'];
    let otherUsername = req.body['otherUsername'];

    let query = 'DELETE FROM Contacts WHERE memberid_a = (SELECT memberid FROM Members WHERE username=$1) AND memberid_b = (SELECT memberid FROM Members WHERE username=$2)'
    db.none(query, [clientUsername, otherUsername])
    .then(() => {
        res.send({
            success: true
        })
    }).catch((err) =>{
        res.send({
            success: false,
            error: err
        })
    });
    
});

module.exports = router;
