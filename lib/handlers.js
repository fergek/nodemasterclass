// request handlers

// dependencies
var _data = require('./data');
var helpers = require('./helpers');

// define handlers
var handlers = {};

handlers.users = function(data, callback) 
{
    var acceptabeMethods = ['get', 'post', 'put', 'delete'];
    if (acceptabeMethods.indexOf(data.method) > -1)
    {
        handlers._users[data.method] (data, callback);
    }
    else
    {
        callback (406);
    }
}

handlers._users = {};

handlers._users.post = function(data, callback){
    // check for required fields
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' ? true : false;
    
    console.log(data.payload);
    console.log('Name', firstName);
    console.log('Last Name', lastName);
    console.log('phone', phone);
    console.log('password', password);
    console.log('tos agreement', tosAgreement);


    if (firstName && lastName && phone && password && tosAgreement)
    {
        // make sure the user doesn't exist
        _data.read('users', phone, function(err, data) {
            if (err)
            {
                let hashedPassword  = helpers.hash(password);
                if (hashedPassword)
                {
                    let userObject =  {
                        'FirstName' : firstName,
                        'LastName' : lastName,
                        'PhoneNumber' : phone,
                        'HashedPassword' : hashedPassword,
                        'TOSAgreement' : true
                    };
    
                    // store the user
                    _data.create('users', phone, userObject, function(err){
                        if(!err)
                        {
                            callback(200);
                        }
                        else
                        {
                            console.log(err);
                            callback(500, {'Error' : 'could not create user'});
                        }
                    });
                }
                else
                {
                    callback (500, {'Error' : 'Problems hashing user password'});
                }
            }
            else
            {
                callback (400, {'Error' : 'User with that phone number already exists'});
            }
        });
    }
    else
    {
        callback (400, {'Error' : 'Missing required fields'});
    }
};

handlers._users.get = function(data, callback){


};

handlers._users.put = function(data, callback){


};

handlers._users.delete = function(data, callback){


};


handlers.ping = function(data, callback)
{
    callback(200);
} ;

handlers.sample = function(data, callback){
    // callback http status code and a payload (object)
    callback(406, {'name' : 'sample.handler'})
};

handlers.notfound = function (data, callback) {
    callback (404);
};

module.exports = handlers;