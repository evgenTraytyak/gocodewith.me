var http = require('http')
  , fs = require('fs')
  , log = require('npmlog')
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
      log.error('HTTP server', err.message)
      response.writeHeader(500)
      response.end('error reading file')
      return;
    }
    
    response.writeHeader(200, {"Content-Type": "text/html"})
    response.write(page)
    response.end()
  });
}).listen(HTTP_PORT)

log.info('HTTP server', 'Server started at port ' + HTTP_PORT)



io.listen(SOCKET_PORT)
  .on('connection', function(socket) {
    log.info('Socket.io server',  'User connected.')
  })

log.info('Socket server', 'Socket.io started at port ' + SOCKET_PORT)
