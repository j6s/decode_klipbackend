/**
 * Created by j on 4/1/16.
 */

module.exports = function(body) {
    return new Promise(function(resolve, reject) {

        if (!body.message) {
            reject("message not given");
            return;
        }
        if (!body.config) {
            reject('config not given');
            return;
        }
        if (!body.message.title) {
            reject('message.title not given');
            return;
        }
        if (!body.message.body) {
            reject('message.body not given');
            return;
        }

        resolve();
    })
};