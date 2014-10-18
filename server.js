var http = require('http')
  , fs = require('fs')
  , _ = require('lodash-node')

  //app variables
  , PORT = 3000;


var server = http.createServer(function(request, response) {
  
}).listen(PORT);

console.log('Server started at port ' + PORT);