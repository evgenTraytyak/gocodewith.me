/**
 * Created by Mantsevich on 21.10.2014.
 */

var _ = require('lodash-node')

// Generator uniq id for users
  , getUID = function () {
    return _.uniqueId('user-')
  }
  , Documents = require('../documents')
// Constructor for User
  , User = module.exports = function (params) {
    this._connection = params.connection
    this.id = getUID()
    this.document = null
    this.props = {
      title: 'Anonymous'
    }
    this._bindEvents()
  }
// Ref to the prototype
  , proto = User.prototype



//region *** Events API ***
// NOTE: All events delegated to connection object
/**
 * Predefined events behavior
 * @type {Object}
 */
proto.events = {
  'open' : '_resolveOpenEvent'
, 'disconnect' : 'destroy'
}

/**
 * Rebind all connection Events
 * @returns {User}
 */
proto._bindEvents = function (events) {
  events = events || this.events
  this.off() // Remove all exists events
  _.each(events, function (callback, event) {
    if (_.isFunction(this[callback]))
      this.on(event, this[callback].bind(this))
  }.bind(this))
  return this
}

/**
 * Subscribe on client event
 * @param event
 * @param callback
 * @returns {User}
 */
proto.on = function (event, callback) {
  this._connection.on(event, callback)
  return this
}

/**
 * Subscribe on client event
 * @param [event]
 * @param [callback]
 * @returns {User}
 */
proto.off = function (event, callback) {
  if (arguments.length === 2)
    this._connection.removeListener(event, callback)
  else
    this._connection.removeAllListeners(event)
  return this;
}

/**
 * Fire event on client (Unsafe!) TODO: Discuss with Team
 * @param event
 * @param data
 * @returns {User}
 */
proto.emit = function (event, data) {
  this._connection.emit(event, data)
  return this
}
//endregion


//region *** Exports data API ***

/**
 * Simple export
 * @returns {{id: *}}
 */
proto.exportOnlyId = function () {
  return {
    id: this.id
  }
}

/**
 * Public data for other users
 * @returns {Object|*}
 */
proto.exportPublicData = function () {
  return _.extend(this.exportOnlyId(), {
    title: this.props.title
  })
}

/**
 * Private data for owner
 * @returns {Object|*}
 */
proto.exportPrivateData = function () {
  return _.extend(this.exportPublicData(), {})
}
//endregion


//region *** Document API ***
/**
 * Open document
 * @param document {Document}
 */
proto.openDocument = function (document) {
  this.document = Documents.factory(document).addCollaborator(this)
  this.emit('open', {
    user: this.exportPrivateData(),
    document: this.document.exportPublicData()
  })
  return this
}

/**
 * Close last opened document
 */
proto.closeDocument = function () {
  if (this.document !== null) this.document.removeCollaborator(this)
  return this
}
//endregion


//region *** Common API & Helpers ***

/**
 * Destroy info about user
 */
proto.destroy = function () {
  this.closeDocument()
}

/**
 * Update user data/props
 * @param data
 * @returns {User}
 */
proto.updateData = function (data) {
  delete data.id
  _.extend(this.props, data)
  return this
}

/**
 * Helper for our "stupid" API
 * @param data
 * @returns {User}
 * @private
 */
proto._resolveOpenEvent = function (data) {
  if (data.user)
    this.updateData(data.user)
  this.openDocument(data.document)
  return this
}
//endregion