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
        console.log('string object', stringDocument);
        var obj = JSON.parse(stringDocument);
        return obj;
    }
    catch(e){
        console.log('Error parsing the object', e);
        return {};
    }
};

helpers.createRandomString = function(stringLenght){
    var strLenght = typeof(stringLenght) == 'number' && stringLenght > 0 ? stringLenght : false;
    if (strLenght)
    {
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        var str = '';
        for (i = 1; i <= strLenght; i++)
        {
            var rndChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += rndChar;
        }
        return str;
    }
    else
    {
        return false;
    }
};

module.exports = helpers;