/*
Primary file for API
*/

const { on } = require('events');
var http = require('http');
var https = require('https');
var url = require ('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require ('./config');
var fs = require ('fs');
// HTTP Server
var server = http.createServer(function (req, res) {
 unifiedServer(req, res);
})

// Start the server on port 3000
server.listen(config.httpport, function(){
    console.log("server listening on", config.httpport, config.envName);
});
/*
var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function(req, res) {
    unifiedServer(req, res);
} );

httpsServer.listen(config.httspport, function(){
    console.log("server listening on", config.httpsport, config.envName);
});
*/

// define handlers
var handlers = {};

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

//define handlers request route
var router = {
    'sample' : handlers.sample,
    'ping' : handlers.ping
};

// refactor : unify logic for creating HTTP and HTTPS servers
var unifiedServer = function(req, res)
{
    process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
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
       var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notfound;
       console.log(chosenHandler);
       //construct data object to send to handler
       var data = {
           'trimmedPath' : trimmedPath,
           'queryStringObject' : queryStringObject,
           'method' : method,
           'headers' : headers,
           'payload' : buffer
       };

       //route request
       chosenHandler(data, 
           function(statusCode, payload)
           {
               //use status code and default to 200
               statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

               //payload called back by the handler or default it to empty
               payload = typeof(payload) == 'object' ? payload : {};

               //convert payload into sting
               var payloadString = JSON.stringify(payload);
               res.setHeader('Content-Type', 'application/json');
               //return the response
               res.writeHead(statusCode);
               
               

               // send response
               res.end(payloadString);

               // log the path the person is asking for
               console.log('Request received on ' + trimmedPath + ' with ' + method);
               console.log('Also, I got this QS parameters: ', queryStringObject);
               console.log('Headers: ', headers);
               console.log('Payload: ', buffer);
               console.log('StatusCode: ', statusCode)
           }
       );
   });
};