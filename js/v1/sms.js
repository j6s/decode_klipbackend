
var express = require('express');
var twilio = require('twilio');

/**
 * Send a sms to a given number
 * @param settings
 * @returns {*}
 */
module.exports = {
    name: 'SMS',
    setup: function(settings, sanitizer) {
        var router = express.Router();
        var client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

        router.post('/', function(req, ret) {
            sanitizer(req.body).then(function() {

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
    },
    schema: function(schema) {
        schema.properties.config.properties.number = { type: 'string' };
        schema.properties.config.required = ['number'];
        return schema;
    }
}