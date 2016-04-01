# deCODE klipfolio notification service


## Plugin base

All providers can be implemented as plugins.
All files in `./v*` folders will be interpreted as plugin files. 

A plugin has to be a javascript file that exports a function that returns a express router.
This function will receive the contents of the settings file as parameter.

Boilerplate for a plugin:

```JavaScripts
var express = require('express');

module.exports = function(settings) {
    var router = express.Router();
    
    // add routes to router
    
    return router;
}
```