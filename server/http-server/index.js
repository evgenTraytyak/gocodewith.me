/**
 * Created by Mantsevich on 21.10.2014.
 */
var http = require('http')
  , fs = require('fs')
  , log = require('npmlog')
  , isStarted = !1

exports.start = function (CONFIG) {
  if (!isStarted) {
    try {
      http.createServer(function (request, response) {
        //reading index file
        fs.readFile(CONFIG.f, function (err, page) {
          if (err) {
            log.error('HTTP server', err.message)
            response.writeHeader(500)
            response.end('error reading file')
            return
          }

          response.writeHeader(200, {'Content-Type': 'text/html'})
          response.write(page)
          response.end()
        })
      }).listen(CONFIG.http_port)
      log.info('HTTP server', 'Server started at port ' + CONFIG.http_port)
      isStarted = !0
    } catch (e) {
      log.error('HTTP server', 'Server can\'t start. ' + e)
    }
  }
}
