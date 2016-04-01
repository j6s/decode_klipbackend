var express = require('express');
var request = require('request');


module.exports = {
    name: 'Webhook',
    setup: function(settings, validator) {
        var router = express.Router();

        router.post('/', function(req, ret) {
            validator(req.body).then(function() {
                var url = req.body.config.url;
                console.log("getting", url);
                request({
                    method: 'GET',
                    uri: url
                }, function(error, response, body) {
                    if (error || response.statusCode !== 200) {
                        ret.status(500).send("error while requesting: " + error);
                        return;
                    }

                    ret.send("all done")
                })
            }, function(errors) {
                ret.status(400).send(errors);
            });

        });

        return router;
    },
    schema: function(schema) {
        return {
            type: 'object',
            properties: {
                config: {
                    type: 'object',
                    properties: {
                        url: { type: 'string' }
                    },
                    required: ['url']
                },
                required: ['config']
            }
        }
    }
};