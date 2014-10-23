/**
 * Created by Mantsevich on 21.10.2014.
 */
var http = require('http')
  , fs = require('fs')
  , log = require('npmlog')
  , isStarted = !1

exports.start = function (config) {
  if (config && !isStarted) {
    try {
      http.createServer(function (request, response) {
        //reading index file
        fs.readFile(config.index, function (err, page) {
          if (err) {
            log.error('HTTP server', err.message)
            response.writeHeader(500)
            response.end('Can\'t read ' + config.index +
                         ' file. (Try to create it: npm run make)')
            return
          }

          response.writeHeader(200, {'Content-Type': 'text/html'})
          response.write(page)
          response.end()
        })
      }).listen(config.port)
      log.info('HTTP server', 'Server started at port ' + config.port)
      isStarted = !0
    } catch (e) {
      log.error('HTTP server', 'Server can\'t start. ' + e)
    }
  }
}
