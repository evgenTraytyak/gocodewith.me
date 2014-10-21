var config = require('./config')
require('./server/http-server').start(config.http_server)
require('./server/socket-server').start(config.socket_server)