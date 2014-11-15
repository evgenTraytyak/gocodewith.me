/**
 * Created by Mantsevich on 22.10.2014.
 */

var _ = require('lodash-node')
  // Generator uniq id for documents
  , getUID = function () {
      return _.uniqueId('file-')
    }
  , Documents = {}
  , Document = module.exports = function (props) {
      props = props || {}
      this.id = props.id || getUID()
      if (Documents[this.id] instanceof Document) return Documents[this.id]
      this.collaborators = []
      this.availableColors = ['#36D7B7', '#19B5FE', '#BF55EC', '#F62459',
        '#FFA400', '#044F67', '#CA6924', '#ABB7B7', '#26C281', '#5D8CAE']
      this.props = _.extend({}, props)
      delete this.props.id
      Documents[this.id] = this
    }
  , proto = Document.prototype



//region *** Events API ***
/**
 * Fire event on collaborators
 * @param data {Object}
 * @param [collaborators] {Array}
 * @returns {Document}
 */
proto.notifyCollaborators = function (data, collaborators) {
  _.each(collaborators || this.collaborators, function (collaborator) {
    if (this.isPresent(collaborator))
      collaborator.emit(data)
  }, this)
  return this
}
//endregion

proto.metaCollaborators = function (source, data) {
  _.each(this.collaborators, function (collaborator) {
    if (source.id !== collaborator.id) {
      collaborator.emit({
        a: 'meta',
        id: data.id,
        color: data.color,
        meta: data.meta
      })
    }
  }, this)
  return this
}

//region *** Manage collaborators ***
/**
 * Attach collaborator to the document
 * @param collaborator {User}
 * @returns {Document}
 */
proto.addCollaborator = function (collaborator) {
  if (!this.isPresent(collaborator)) {
    collaborator.setColor(this.getAvailableColor())

    this.notifyCollaborators({
      a: 'join',
      user : collaborator.exportPublicData()
    })
    this.collaborators.push(collaborator)
  }
  return this
}

proto.getAvailableColor = function () {
  var color = this.availableColors[0] || this.getRandomColor()

  _.pull(this.availableColors, color)

  return color
}

proto.restoreColor = function (color) {
  var colorsArr = []

  colorsArr.push(color)
  _.union(colorsArr, this.availableColors)

  this.availableColors = colorsArr
}

/**
 * Detach collaborator from document
 * @param collaborator {User}
 * @returns {Document}
 */
proto.removeCollaborator = function (collaborator) {
  if (this.isPresent(collaborator)) {
    _.pull(this.collaborators, collaborator)
    this.notifyCollaborators({
      a: 'leave',
      user: collaborator.exportOnlyId()
    })
    this.restoreColor(collaborator.getColor())
  }
  return this
}

/**
 * Check, collaborator is present or not in the document
 * @param collaborator {User}
 * @returns {boolean}
 */
proto.isPresent = function (collaborator) {
  return _.indexOf(this.collaborators, collaborator) > -1
}
//endregion


//region *** Exports API ***
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
 * Public data for users
 * @returns {*}
 */
proto.exportPublicData = function () {
  return _.extend(this.exportOnlyId(), {
    users: _.map(this.collaborators, function (collaborator) {
      return collaborator.exportPublicData()
    })
  })
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
//endregion
