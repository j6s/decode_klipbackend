
var express = require('express');
var twilio = require('twilio');
var sanitize = require('../lib/sanitizer');

/**
 * Send a sms to a given number
 * @param settings
 * @returns {*}
 */
module.exports = function(settings) {
    var router = express.Router();
    var client = twilio(settings.twilio.sid, settings.twilio.token);

    router.post('/', function(req, ret) {
        sanitize(req.body).then(function() {

            if (!req.body.config.number) {
                ret.send(400).send('config.number  not specified');
                return;
            }

            client.messages.create({
                to: req.body.config.number,
                body: req.body.message.body,
                from: '+14387939008'
            }, function(err ,message) {
                if (err) {
                    ret.status(500).send(err);
                    return;
                } else {
                    ret.send('All done ' + message.pid);
                }
            });

        }, function(err) {
            ret.status(500).send(err);
        })
    });

    return router;
};