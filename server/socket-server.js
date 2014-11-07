/**
 * Created by Mantsevich on 21.10.2014.
 */
var log = require('npmlog')
  , Users = require('./users')
  , logPrefix = 'Socket Server'
  , WebSocketServer = require('ws').Server


exports.start = function (config) {
  if (config) {
    try {
      var wss = new WebSocketServer(config)

      wss.on('connection', Users.factory)
    } catch (err) {
      log.error(logPrefix, 'Server can\'t start. ' + err)
    }
  }
}
