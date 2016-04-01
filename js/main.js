var express = require('express');
var settings = require('../settings.json');

var app = express();
app.get('/', function(req, res) {
    res.send("Hello World");
});

app.listen(settings.port);

