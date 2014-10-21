/**
 * Created by Mantsevich on 21.10.2014.
 */
var _ = require('lodash-node')
  , io = require('socket.io')()
  , log = require('npmlog')
  , logPrefix = 'Socket Server'
  , isStarted = !1

exports.start = function (CONFIG) {
  if (!isStarted) {
    try {
      io.listen(CONFIG.socket_port)
        .on('connection', function (socket) {
          socket.on('open', function (data) {
            var user = {
                title: data.title || 'Anonimus'
              , id: _.uniqueId('user')
              }
              , docId = (data.document && data.document.id) ?
                data.document.id :
                _.uniqueId('file')

            io.to(docId).emit('join', {
              user: user
            })

            socket.emit('open', {
              user: user
            , document: {
                id: docId
              , users: []
              }
            })
            socket.join(docId)
          })
        })

      log.info(logPrefix
        , 'Socket.io started at port ' + CONFIG.socket_port)
      isStarted = !0
    } catch (e) {
      log.error(logPrefix, 'Server can\'t start. ' + e)
    }
  }
}