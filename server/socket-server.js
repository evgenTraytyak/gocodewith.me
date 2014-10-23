/**
 * Created by Mantsevich on 21.10.2014.
 */
var io = require('socket.io')()
  , log = require('npmlog')
  , Users = require('./users')
  , logPrefix = 'Socket Server'
  , isStarted = !1

exports.start = function (config) {
  if (config && !isStarted) {
    try {
      io.listen(config.port)
        .on('connection', Users.factory)

      log.info(logPrefix
        , 'Socket.io started at port ' + config.port)
      isStarted = !0
    } catch (e) {
      log.error(logPrefix, 'Server can\'t start. ' + e)
    }
  }
}