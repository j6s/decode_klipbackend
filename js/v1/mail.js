'use-strict'
const express = require('express');
const mailgun = require('mailgun').Mailgun;
const mg = new mailgun(process.env.MAILGUN);

/**
 * simple module that sends an email
 * @returns {*}
 */
module.exports = {
    name: 'E-Mail',
    setup: function(settings, sanitizer) {
        var router = express.Router();

        router.post('/', function(req, ret) {

            sanitizer(req.body).then(function() {
                console.log("---");
                console.log("Received email reuest");

                const dest_email = req.body.config.email;
                console.log("email: ", dest_email);

                const msg_title = req.body.message.title;
                console.log("msg_tile: ", msg_title);

                const msg_body = req.body.message.body;
                console.log("msg_tile: ", msg_body);

                const sender = 'test@Sandboxa2d891de41d64303a3a35d367eded163.Mailgun.Org'

                // Send the message
                mg.sendText(sender, dest_email, msg_title, msg_body, function(err) {
                    if (err) {
                        console.log(err);
                        ret.status(500).send("error while sending email: " + err);
                        return;
                    }

                    ret.send("Email sent succesfully.");
                });
            }, function(errors) {
                ret.status(400).send(errors);
            });

        });

        return router;
    },
    schema: function(schema) {
        schema.properties.config.properties.email = {
            type: 'array',
            items: {
                type: 'string',
                pattern: "^\\S+@\\S+$"
            },
            minItems: 1,
            uniqueItems: true
        };
        schema.properties.config.required = [ 'email' ];
        return schema;
    }
};
