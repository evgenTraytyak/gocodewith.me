var Users = require('./users')
  , WebSocketServer = require('ws').Server


exports.start = function (config) {
  if (config) {
    config.port = process.env.PORT_WS || config.port

    try {
      var wss = new WebSocketServer(config)

      wss.on('connection', Users.factory)

    } catch (err) {
      console.log('WebSocket Server can\'t start'.red.bold, err)
    }
  }
}
