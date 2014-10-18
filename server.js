var http = require('http')
  , fs = require('fs')
  , _ = require('lodash-node')
  , path = require('path')
  //socket
  , io = require('socket.io')()


  //app variables
  , HTTP_PORT = 80 // server http port
  , SOCKET_PORT = 7900 // socket port
  , indexFile = path.join(__dirname, 'index.html')


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
}).listen(HTTP_PORT)

console.log('Server started at port ' + HTTP_PORT)

io.listen(SOCKET_PORT)
  .on('connection', function(socket) {
    console.log('User connected.')
  })
