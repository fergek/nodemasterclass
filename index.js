/*
Primary file for API
*/

const { on } = require('events');
var http = require('http');
var url = require ('url');
var StringDecoder = require('string_decoder').StringDecoder;

// Server should respond to all with a string
var server = http.createServer(function (req, res) {
    // Get URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the PATH for URL
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //get qs as object
    var queryStringObject = parsedUrl.query;

    // get the http method
    var method = req.method.toLowerCase();

    // get headers as object
    var headers = req.headers;

    // get the payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    })
    req.on('end', function(){
        buffer += decoder.end;

        // choose handler
        var chosenHandler = typeof(router[trimmedPath] !== 'undefined') ? router[trimmedPath] : handlers.notfound;

        //construct data object to send to handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        //route request
        chosenHandler(data, function(statusCode, payload){
            //use status code and default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //payload called back by the handler or default it to empty
            payload = typeof(payload) == 'object' ? payload : {};

            //convert payload into sting
            var payloadString = JSON.stringify(payload);

            //return the response
            res.writeHead(statusCode);
            
            // send response
            res.end(payloadString);

            // log the path the person is asking for
            console.log('Request received on ' + trimmedPath + ' with ' + method);
            console.log('Also, I got this QS parameters: ', queryStringObject);
            console.log('Headers: ', headers);
            console.log('Payloead: ', buffer);
        });
    })

})

// Start the server on port 3000
server.listen(3000, function(){
    console.log("server listening on 3000");
});

// define handlers
var handlers = {};
handlers.sample = function(data, callback){
    // callback http status code and a payload (object)
    callback(406, {'name' : 'sample.handler'})
};

handlers.notfound = function (data, callback) {
    callback (404, {'name' : 'not found'});
};

//define handlers request route
var router = {
    'sample' : handlers.sample
};