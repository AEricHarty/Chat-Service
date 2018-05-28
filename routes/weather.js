//express is the framework we're going to use to handle requests
const express = require('express');

//request module is needed to make a request to a web service
const request = require('request');

const bodyParser = require("body-parser");

var router = express.Router();
router.use(bodyParser.json());

const API_KEY = process.env.OPENWEATHERMAP_KEY;


router.post("/currentgps", (req, res) => {
    res.type("application/json");
    var lat = req.body['username'];
    var lon = req.body['email'];
    var url = `api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`;
    
    res.send({
        success: url
    });
    request(url, function (error, response, body) {
        if (error) {
            res.send(error);
        } else {
            res.send(body);
            //res.send(response);
        }
    });
});

router.post("/currentzip", (req, res) => {
    res.type("application/json");
    var zip = req.body['username'];
    var url = `api.openweathermap.org/data/2.5/weather?zip=${zip},us&APPID=${API_KEY}`;
    
    request(url, function (error, response, body) {
        if (error) {
            res.send(error);
        } else {
            res.send(body);
        }
    });
});

router.post("/forecastzip", (req, res) => {
    res.type("application/json");
    var zip = req.body['username'];
    var url = `api.openweathermap.org/data/2.5/forecast?zip=${zip},us&APPID=${API_KEY}`;
    
    request(url, function (error, response, body) {
        if (error) {
            res.send(error);
        } else {
            res.send(body);
        }
    });
});

router.post("/forecastgps", (req, res) => {
    res.type("application/json");
    var lat = req.body['username'];
    var lon = req.body['email'];
    var url = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${API_KEY}`;
    
    request(url, function (error, response, body) {
        if (error) {
            res.send(error);
        } else {
            res.send(body);
        }
    });
});

module.exports = router;