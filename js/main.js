var express = require('express');
var settings = require('../settings.json');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var rateLimit = require('./lib/rateLimit');

var app = express();
app.use(bodyParser.json());
app.use(rateLimit());

// Setup the server
app.set('port', (process.env.PORT || settings.port));

app.listen(app.get('port'), function() {
    console.log('Notifier app is running on port', app.get('port'));
});


var generalSchema = {
    type: 'object',
    properties: {
        message: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                body: { type: 'string' }
            },
            required: ['title', 'body']
        },
        config: {
            type: 'object',
            properties: {}
        },
        required: ['message', 'config']
    }
};

/**
 * v1 module setup:
 * - initializes all files from the v1 folder and applies them to routes based on their filename
 *
 * ./v1/webhook.js will be applied to /v1/webhook
 *
 * @type {string}
 */
var v1 = path.join(__dirname, 'v1');
var v1Routes = [];
fs.readdirSync(v1).forEach(function(file) {
    var route = '/v1/' + file.replace('.js', '');

    var service = require(path.join(v1,file));
    if (typeof service === 'object') {
        console.log('mounting', file, 'to', route);
        var routeInfo = {
            endpoint: route,
            name: service.name,
            schema: service.schema(JSON.parse(JSON.stringify(generalSchema)))
        };
        v1Routes.push(routeInfo);

        app.get(route, function(req, ret) {
            ret.send(routeInfo);
        });
        app.use(route, service.setup(settings))
    }
});

/**
 * List all of the v1 routes
 */
app.get('/v1', function(req, ret) {
    ret.send(JSON.stringify(v1Routes));
});

/**
 * List all of the routes
 */
app.get('/', function(req, ret) {
    ret.send(JSON.stringify(['/v1']));
});
