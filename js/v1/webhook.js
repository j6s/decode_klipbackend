var express = require('express');

module.exports = function() {
    var router = express.Router();

    router.get('/', function(req, ret) {
        ret.send("webhook");
    });

    return router;
};