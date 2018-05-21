//express is the framework we're going to use to handle requests
const express = require('express');

//request module is needed to make a request to a web service
const request = require('request');

const bodyParser = require("body-parser");

var router = express.Router();
router.use(bodyParser.json());

const API_KEY = process.env.ACCUWEATHER_KEY;

router.post("/locategps", (req, res) => {
    res.type("application/json");
    var lat = req.body['username'];
    var lon = req.body['email'];
    var url = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${lat}%2C${lon}&language=en-us&details=false&toplevel=false`;
    
    request(url, function (error, response, body) {
        if (error) {
            res.send(error);
        } else {
            // pass on everything (try out each of these in Postman to see the difference)
            // res.send(response);
            // or just pass on the body
            res.send(body);
        }
    });
});

router.post("/locatezip", (req, res) => {
    res.type("application/json");
    var zip = req.body['username'];
    var url = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${API_KEY}&q=${zip}&language=en-us&details=false`;
    
    request(url, function (error, response, body) {
        if (error) {
            res.send(error);
        } else {
            res.send(body);
        }
    });
});

router.post("/current", (req, res) => {
    res.type("application/json");
    var location = req.body['username'];
    var url = `http://dataservice.accuweather.com/currentconditions/v1/${location}?apikey=${API_KEY}&language=en-us&details=false`;
    
    request(url, function (error, response, body) {
        if (error) {
            res.send(error);
        } else {
            res.send(body);
        }
    });
});

router.post("/fiveday", (req, res) => {
    res.type("application/json");
    var location = req.body['username'];
    var url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day${location}?apikey=${API_KEY}&language=en-us&details=false&metric=false`;

    request(url, function (error, response, body) {
        if (error) {
            res.send(error);
        } else {
            res.send(body);
        }
    });
});

router.post("/nextday", (req, res) => {
    res.type("application/json");
    var location = req.body['username'];
    var url = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${location}?apikey=${API_KEY}&language=en-us&details=false&metric=false`;
    
    request(url, function (error, response, body) {
        if (error) {
            res.send(error);
        } else {
            res.send(body);
        }
    });
});

module.exports = router;