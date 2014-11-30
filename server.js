// Global node packages
colors = require('colors')
path = require('path')
fs = require('fs')

// Global root path
dir_root = __dirname

var config = require('./config')

// Load files from directory (relative path)
var loadFiles = function(path) {
  fs.readdirSync(dir_root + path).forEach(function (file) {
    if (~file.indexOf('.js')) require(dir_root + path + '/' + file)
  })
}

loadFiles('/api/models')
loadFiles('/api/controllers')

require('./server/http-server').start(config.http_server)
require('./server/socket-server').start(config.socket_server)
