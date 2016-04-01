/**
 * Created by j on 4/1/16.
 */
var moment = require('moment');

module.exports = function(settings) {
    if (!settings) {
        settings = {};
    }
    settings.timeout = .1;

    var timeouts = {};
    return function (req, res, next) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var timeout = timeouts[ip] || 0;

        if (timeout > moment().unix()) {
            // reject
            res.status(429).send('too many requests');
        } else {
            // accpet
            timeouts[ip] = moment().unix() + settings.timeout;
            console.log(timeouts);
            next();
        }
    }
};
