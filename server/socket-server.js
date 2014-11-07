/**
 * Created by Mantsevich on 21.10.2014.
 */
var log = require('npmlog')
  , Users = require('./users')
  , logPrefix = 'Socket Server'
  , isStarted = !1
  , Duplex = require('stream').Duplex
  , livedb = require('livedb')
  , sharejs = require('share')
  , backend = livedb.client(livedb.memory())
  , share = sharejs.server.createClient(
    { backend: backend
    }
  )
  , WebSocketServer = require('ws').Server


exports.start = function (config) {
  var socket = {}
    , stream = {}
    , User

  if (config && !isStarted) {
    try {
      var wss = new WebSocketServer(config)

      wss.on('connection', function (socketObj) {
        stream = new Duplex({ objectMode: true })

        socket = socketObj

        User = Users.factory(socket, stream)

        isStarted = !0

        return share.listen(stream)
      })
    } catch (err) {
      log.error(logPrefix, 'Server can\'t start. ' + err)
    }
  }
}
