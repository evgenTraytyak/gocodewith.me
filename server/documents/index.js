/**
 * Created by Mantsevich on 23.10.2014.
 */

var Document = require('./document')

/**
 * Document factory. Currently is very simple,
 * but in the future we can manage some type of docs
 */
exports.factory = function (props) {
  return new Document(props)
}