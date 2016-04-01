var express = require('express');
var request = require('request');

/**
 * simple module that calls another webhhok.
 * expects config.url to be set
 * @returns {*}
 */
module.exports = function() {
    var router = express.Router();

    router.post('/', function(req, ret) {
        if (!req.body.config) {
            ret.status(400).send("config not set");
            return;
        }
        if (!req.body.config.url) {
            ret.status(400).send("config.url not set");
            return;
        }

        var url = req.body.config.url;
        console.log("getting", url);
        request({
            method: 'GET',
            uri: url
        }, function(error, response, body) {
            if (error && response.code !== 200) {
                res.send(500).send("error while requesting: " + error);
                return;
            }

            ret.send("all done")
        })
    });

    return router;
};