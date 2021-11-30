// helpers for various tasks
var crypto = require('crypto');
var config = require('../config');

var helpers = {};

helpers.hash = function(unhashed){
    if (typeof(unhashed) == 'string' && unhashed.length > 0)
    {
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(unhashed).digest('hex');
        return hash;
    }
    else
    {
        return false;
    }
};

helpers.parseJsonToObject = function(stringDocument){
    try
    {
        var obj = JSON.parse(stringDocument);
        return obj;
    }
    catch(e){
        return {};
    }
};

module.exports = helpers;