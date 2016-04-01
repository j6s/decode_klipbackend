/**
 * Created by j on 4/1/16.
 */
var Validator = require('jsonschema').Validator;
var v = new Validator();

module.exports = function(schema) {
    return function(json) {
        return new Promise(function(resolve, reject) {
            var result = v.validate(json, schema);
            if (result.errors.length === 0) {
                resolve();
            } else {
                var errors = [];
                result.errors.forEach(function(error) {
                    errors.push(error.stack);
                });
                reject(errors);
            }
        });
    }
};