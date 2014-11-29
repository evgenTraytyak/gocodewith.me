var User = require('./user')

exports.factory = function (connection) {
  return new User(
    { connection: connection
    }
  )
}
