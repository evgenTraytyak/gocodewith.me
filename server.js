var http = require('http')
  , fs = require('fs')
  , log = require('npmlog')
  , path = require('path')
  //socket
  , io = require('socket.io')()

  //app variables
  , CONFIG = {
      http_port: 80 // node server.js http_port=80
    , socket_port: 7900
    , f: path.join(__dirname, 'index.html')
  }

// Parse server params
process.argv.slice(2).forEach(function (val) {
  try {
    var param = val.split('=')
    if (param[1]) CONFIG[param[0]] = param[1]
  } catch (e) {
    log.error('Internal', 'Cant parse param ' + val)
  }
})

http.createServer(function (request, response) {
  //reading index file
  fs.readFile(CONFIG.f, function (err, page) {
    if (err) {
      log.error('HTTP server', err.message)
      response.writeHeader(500)
      response.end('error reading file')
      return;
    }

    response.writeHeader(200, {'Content-Type': 'text/html'})
    response.write(page)
    response.end()
  })
}).listen(CONFIG.http_port)

log.info('HTTP server', 'Server started at port ' + CONFIG.http_port)



io.listen(CONFIG.socket_port)
  .on('connection', function(socket) {
    var username = '' + Math.random()

    log.info('Socket.io server',  'User ' + username + ' has connected')

    io.emit('join', {username: username})

    socket.on('disconnect', function() {
      log.info('Socket.io server',  'User ' + username + ' has disconnected')
      socket.broadcast.emit('leave', {username: username})
    })

  })

log.info('Socket server', 'Socket.io started at port ' + CONFIG.socket_port)
