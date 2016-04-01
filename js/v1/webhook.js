var express = require('express');
var request = require('request');


module.exports = {
    name: 'Webhook',
    setup: function() {
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
                if (error || response.statusCode !== 200) {
                    ret.status(500).send("error while requesting: " + error);
                    return;
                }

                ret.send("all done")
            })
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