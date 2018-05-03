//express is the framework we're going to use to handle requests
const express = require('express');

const bodyParser = require("body-parser");

var router = express.Router();
router.use(bodyParser.json());

router.get("/", (req, res) => {
    res.send({
        //req.query is a reference to arguments in the url
        message: "Hello, " + req.query['name'] + "!"
    });
});

router.post("/", (req, res) => {
    res.send({
        //req.query is a reference to arguments in the POST body
        message: "Hello, " + req.body['name'] + "! You sent a POST Request"
    });
});

module.exports = router;