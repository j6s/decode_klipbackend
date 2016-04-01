/**
 * Created by j on 4/1/16.
 */

var express = require('express');
var request = require('request');
var sanitizer = require('../lib/sanitizer');
var querystring = require('querystring');

/**
 * Sends a message to slack
 *
 * channel can be set via config.channel
 *
 * @param settings
 * @returns {*}
 */
module.exports = {
    name: 'Slack',
    setup: function(settings) {

        var router = express.Router();

        router.post('/', function(req, res) {
            sanitizer(req.body).then(function() {

                var params = [
                    'token=' +      querystring.escape(settings.slack.token),
                    'channel=' +    querystring.escape(req.body.config.channel || '#alertsonfire'),
                    'text=' +       querystring.escape(req.body.message.body),
                    'as_user=false',
                    'username=' +    querystring.escape(req.body.message.title)
                ].join('&');

                request({
                    method: 'GET',
                    uri: 'https://slack.com/api/chat.postMessage?' + params
                }, function(err, response, body) {
                    if (err || response.statusCode !== 200) {
                        res.status(500).send("request failed " + err);
                        return;
                    }

                    res.send("all done");
                })

            }, function(err) {
                ret.status(500).send(err);
            });
        });

        return router;
    },
    schema: function(schema) {
        schema.properties.config.properties.channel = { type: 'string' };
        return schema;
    }
}