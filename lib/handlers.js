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

handlers.tokens = function(data, callback) {
    var acceptabeMethods = ['get', 'post', 'put', 'delete'];
    if (acceptabeMethods.indexOf(data.method) > -1)
    {
        handlers._tokens[data.method] (data, callback);
    }
    else
    {
        callback (406);
    }
};

handlers._users = {};
handlers._tokens = {};

handlers._tokens.post = function(data, callback) {
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (phone && password)
    {
        _data.read("users", phone, function(err, data){
            if (!err && data)
            {
                var hashedPassword = helpers.hash(password);
                if (hashedPassword == data.HashedPassword)
                {
                    var tokenId = helpers.createRandomString(200);
                    var expires = Date.now() + 1000 * 60 * 60;
                    var tokenObject = {
                        'phone' : phone,
                        'id' : tokenId,
                        'expires' : expires
                    };
                    _data.create ('tokens', tokenId, tokenObject, function(err){
                        if(!err)
                        {
                            callback (200, tokenObject);
                        }
                        else
                        {
                            callback (500, {'Errror' : 'Could not create the token'});
                        }
                    });
                }
                else
                {
                    callback (400, {'Error' : 'Password did not match specified user stored'})
                }
            }
            else
            {
                callback (400, {'Error' : 'cant find user'})
            }

        })
    }
    else
    {
        callback (400, {'Error' : 'missing required data'})
    }
}

handlers._tokens.get = function(data, callback) {
    
}



handlers._tokens.put = function(data, callback) {
    
}



handlers._tokens.delete = function(data, callback) {
    
}


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

// @TODO only let authenticated user access the own data
handlers._users.get = function(data, callback){
    //check that we have a valid phone number
    var phone = typeof(data.queryStringObject.phone =='string' && data.queryStringObject.phone.trim() ==10) ? data.queryStringObject.phone : false;
    if (phone)
    {
        _data.read("users", phone, function(err, data){
            if(!err && data)
            {
                // remove password from the user object
                delete data.HashedPassword;
                callback (200, data);
            }
            else
            {
                callback (404);
            }
        });
    }
    else
    {
        callback(400, {'Error' : 'invalid or no phone number'});
    }
};

                
handlers._users.put = function(data, callback){
    var phone = typeof(data.payload.phone =='string' && data.payload.phone.trim() ==10) ? data.payload.phone : false;
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  
    console.log ('name', firstName);

    if (phone && (firstName || lastName || password)  )
    {
        _data.read("users", phone, function(err, userData){
            if(!err && data)
            {
                if (firstName)
                {
                    userData.FirstName = firstName;
                }
                if (lastName)
                {
                    userData.LastName = lastName;
                }
                _data.update('users', phone, userData, function(err){
                    if (!err)
                    {
                        callback (200);
                    }
                    else
                    {
                        console.log(err);
                        callback (500, {'Error' : 'Unable to update user'});
                    }
                })
                callback (200, data);
            }
            else
            {
                callback (400, {'Error' : 'user not found'});
            }
        });
    }
    else
    {
        callback(400, {'Error' : 'Some fields are missing'});
    }
};

handlers._users.delete = function(data, callback){
    var phone = typeof(data.queryStringObject.phone =='string' && data.queryStringObject.phone.trim() ==10) ? data.queryStringObject.phone : false;
    if (phone)
    {
        _data.delete("users", phone, function(err){
            if (!err)
            {
                callback(200);
            }
            else
            {
                console.log(err);
                callback (500, {'Error' : 'cant delete user'});
            }
        })
    }
    else
    {

    }

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