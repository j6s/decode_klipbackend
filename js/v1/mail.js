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
    setup: function() {
        var router = express.Router();

        router.post('/', function(req, ret) {
            if (!req.body.config) {
                ret.status(400).send("config not set");
                return;
            }
            if (!req.body.config.email) {
                ret.status(400).send("config.email not set");
                return;
            }
            if (!req.body.message.title) {
                ret.status(400).send("message.title not set");
                return;
            }
            if (!req.body.message.body) {
                ret.status(400).send("message.body not set");
                return;
            }

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
        });

        return router;
    },
    schema: function(schema) {
        schema.properties.config.properties.email = { type: 'string' };
        schema.properties.config.required = [ 'email' ];
        return schema;
    }
};