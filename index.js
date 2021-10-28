/*
Primary file for API
*/

//Dependencies
var http = require('http');
var url = require ('url');

// Server should respond to all with a string
var server = http.createServer(function (req, res) {
    // Get URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the PATH for URL
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');


    // send response
    res.end('Hello World!');

    // log the path the person is asking for
    console.log('Request received on ' + trimmedPath);

})

// Start the server on port 3000
server.listen(3000, function(){
    console.log("server listening on 3000");
})