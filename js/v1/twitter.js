var express = require('express');
var twitter = require('twitter');

/**
*	Module to tweet
*
*/


module.exports = {
    name:'twitter',
    setup: function(settings, sanitizer){
        [
            'TWITTER_CONSUMER_KEY', 
            'TWITTER_CONSUMER_SECRET',
            'TWITTER_ACCESS_TOKEN_KEY',
            'TWITTER_ACCESS_TOKEN_SECRET'
        ].forEach(function(env) {
            if (!process.env[env]) {
                throw "environment variable " + env + " is not set";
            }
        })
        var router = express.Router();

        router.post('/', function(req, ret){
            sanitizer(req.body).then(function(){

            console.log("hello");

            var client = new twitter({
                consumer_key: process.env.TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
                access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
            });

            console.log("this on?");
            client.post('statuses/update', {status: req.body.message.body}, function(error, tweet, response){
                if (error) {
                    console.log(tweet);
                    ret.status(500).send(error);
                } else {
                    ret.send(response)
                }
            });

            




            }, function(err){
                ret(500).send(err);
            });
        
    });

    
	

	return router;
    },
    schema: function(schema) {
        return schema;
    }
}
