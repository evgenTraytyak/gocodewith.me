var http = require('http')
  , fs = require('fs')
  , _ = require('lodash-node')

  //app variables
  , PORT = 80 // server http port
  , indexFile = 'index.html'


http.createServer(function(request, response) {
  //reading index file
  fs.readFile(indexFile, function(err, page) {
    if (err) {
      console.log('error reading file')
      response.writeHeader(500)
      response.end('error reading file')
      return;
    }
    
    response.writeHeader(200, {"Content-Type": "text/html"})
    response.write(page)
    response.end()
  });
}).listen(PORT)

console.log('Server started at port ' + PORT)