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
