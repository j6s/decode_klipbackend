var express = require('express');
var request = require('request');

module.exports = {
  name: 'Pushbullet',
  setup: function(settings, sanitizer) {
    var router = express.Router();

    router.post('/', function(req, ret) {
      sanitizer(req.body).then(function() {

        request({
          method: 'POST',
          uri: 'https://api.pushbullet.com/v2/pushes',
          headers: {
            'Access-Token': process.env.PUSHBULLET
          },
          json: {
            type: 'note',
            title: req.body.message.title,
            body: req.body.message.body,
            email: req.body.config.email
          }
        }, function(err, req, body) {
          if (err  || req.statusCode !== 200) {
            ret.status(500).send(err);
            return;
          }
          ret.send('all done');
        })

      }, function(err) {
        ret.status(400).send(err);
      })
    })

    return router;
  },
  schema: function(schema) {
    schema.properties.config.properties.email = { type: 'string' };
    schema.properties.config.required = [ 'email' ];
    return schema;
  }
}
