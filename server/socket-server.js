/**
 * Created by Mantsevich on 21.10.2014.
 */
var log = require('npmlog')
//, io = require('socket.io')()
//, Users = require('./users')
  , logPrefix = 'Socket Server'
  , isStarted = !1
  , Duplex = require('stream').Duplex
  , livedb = require('livedb')
  , sharejs = require('share')
  //store sharejs documents in memory
  , backend = livedb.client(livedb.memory())
  , share = sharejs.server.createClient({
    backend: backend
  })
  , WebSocketServer = require('ws').Server


exports.start = function (config) {
  if (config && !isStarted) {
    try {
      var wss = new WebSocketServer(config)

      wss.on('connection', function (socket) {
        log.info(logPrefix
          , 'Socket.io started at port ' + config.port)
        isStarted = !0

        var stream = new Duplex({ objectMode: true })

        stream._write = function (chunk, encoding, callback) {
          console.log('server -> client ', chunk)
          socket.send(JSON.stringify(chunk))
          return callback()
        }

        stream._read = function () {}

        stream.headers = socket.upgradeReq.headers

        stream.remoteAddress = socket.upgradeReq.connection.remoteAddress

        socket.on('message', function (data) {
          console.log('client -> server ', data)
          return stream.push(JSON.parse(data))
        })

        stream.on('error', function (msg) {
          return socket.close(msg)
        })

        socket.on('close', function (reason) {
          stream.push(null)
          stream.emit('close')
          console.log('client went away')
          return socket.close( reason )
        })

        stream.on('end', function () {
          return socket.close()
        })

        return share.listen(stream)
      })
    } catch (err) {
      log.error(logPrefix, 'Server can\'t start. ' + err)
    }
  }
}
