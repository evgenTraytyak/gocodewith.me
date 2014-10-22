/**
 * Created by Mantsevich on 21.10.2014.
 */

var User = require('./user')

/**
 * User factory. Currently is very simple,
 * but in the future we can manage some roles
 * without changes for API
 */
exports.factory = function (connection) {
  return new User({
    connection: connection
  })
}