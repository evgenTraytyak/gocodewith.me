var http = require('http')
  , fs = require('fs')
  , log = require('npmlog')
  , path = require('path')
  , _ = require('lodash-node')
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
    if (param[1]) { CONFIG[param[0]] = param[1] }
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
  .on('connection', function (socket) {
    socket.on('open', function (data) {
      var user = {
            title: data.title || 'Anonimus'
          , id: _.uniqueId('user')
          }
          , docId = (data.document && data.document.id)?
                    data.document.id :
                    _.uniqueId('file')

      io.to(docId).emit('join', {
        user: user
      })

      socket.emit('open', {
        user: user,
        document: {
          id: docId,
          users: []
        }
      });

      socket.join(docId);

    })
  })

log.info('Socket server', 'Socket.io started at port ' + CONFIG.socket_port)
