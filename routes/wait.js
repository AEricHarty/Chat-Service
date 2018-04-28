//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();

var router = express.Router();

router.get("/", (req, res) => {
    setTimeout(() => {
        res.send({
        message: "Thanks for waiting"
        });
    }, 1000);
});

router.post("/", (req, res) => {
    res.send({
        message: "Thanks for waiting on that POST"
    });
});

module.exports = router;