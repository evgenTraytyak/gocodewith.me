var log = require('npmlog')
  , path = require('path')

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

require('./server/http-server').start(CONFIG)
require('./server/socket-server').start(CONFIG)