/*
Primary file for API
*/

//Dependencies
var http = require('http');

// Server should respond to all with a string
var server = http.createServer(function (req, res) {
    res.end("HEllo world\n");
})

// Start the server on port 3000
server.listen(3000, function(){
    console.log("server listening on 3000");
})