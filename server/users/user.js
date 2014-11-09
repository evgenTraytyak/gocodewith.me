/**
 * Created by Mantsevich on 21.10.2014.
 */

var _ = require('lodash-node')
  , Duplex = require('stream').Duplex
  , livedb = require('livedb')
  , sharejs = require('share')
  , backend = livedb.client(livedb.memory())
  , share = sharejs.server.createClient(
    { backend: backend
    }
  )
  , colors = [ 'red', 'yellow', 'green', 'blue', 'grey', 'gold', 'pink']

  , getUID = function () {
    return _.uniqueId()
  }
  , Documents = require('../documents')
  , User = function (options) {
    var self = this

    _.bindAll(this, 'onMessage')

    this._connection = options.connection
    this._stream = new Duplex({ objectMode: true })

    this.id = getUID()
    this.document = null
    this.props =
    { title: 'Anonymous'
    }

    this._stream._write = function (chunk, encoding, callback) {
      self._connection.send(JSON.stringify(chunk))

      return callback()
    }

    this._stream._read = function () {}

    this._stream.headers = this._connection.upgradeReq.headers
    this._stream.remoteAddress =
      this._connection.upgradeReq.connection.remoteAddress

    this._connection.on('message', this.onMessage)

    this._stream.on('error', function (msg) {
      console.log('error', msg)
      return self._connection.close(msg)
    })

    this._connection.on('close', function (reason) {
      self._stream.push(null)
      self._stream.emit('close')
      self.destroy();
      return self._connection.close( reason )
    })

    this._stream.on('end', function () {
      return self._connection.close()
    })

    share.listen(this._stream)
  }
  , proto = User.prototype

module.exports = User

proto.onMessage = function (data) {
  var jsonData = JSON.parse(data)

  if (jsonData.a === 'open')
  { this.onOpenEvent(jsonData)
    return;
  }

  return this._stream.push(jsonData)
}

/**
 * Fire event on client (Unsafe!) TODO: Discuss with Team
 * @param event
 * @param data
 * @returns {User}
 */
proto.emit = function (data) {
  this._connection.send(JSON.stringify(data))
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
  return _.extend(this.exportOnlyId(),
    { title: this.props.title
    , color: colors[this.id - 1] || this.getRandomColor()
    }
  )
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
  this.emit({
    a: 'open',
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
 * Update user data/props
 * @param data
 * @returns {User}
 */
proto.updateData = function (data) {
  delete data.id

  _.extend(this.props, data, function (a, b) {
    return b ? b : a
  })

  return this
}

/**
 * Helper for our API
 * @param data
 * @returns {User}
 * @private
 */
proto.onOpenEvent = function (data) {
  if (data.user)
    this.updateData(data.user)
  this.openDocument(data.document)
  return this
}
/**
 * Destroy info about user
 */
proto.destroy = function () {
  this.closeDocument()
}

proto.getRandomColor = function () {
  var letters = ('0123456789ABCDEF').split('')
    , color = '#'
    , i = 0;

  for (i; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}
