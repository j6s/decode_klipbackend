var express = require('express');
var settings = require('../settings.json');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

// Setup the server
app.set('port', (process.env.PORT || settings.port));

app.listen(app.get('port'), function() {
    console.log('Notifier app is running on port', app.get('port'));
});

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
    v1Routes.push(route);

    console.log('mounting', file, 'to', route);
    var router = require(path.join(v1,file));
    app.use(route, router(settings));
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
