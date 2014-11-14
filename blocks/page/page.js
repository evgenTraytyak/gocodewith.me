var Team1 = Team1 || {};

Team1 = {
  start : function (options) {
    _.bindAll(this);

    this.documentId = this.getDocId()

    this.socket = this.getSocket(options.socketUrl)
    this.sjs = new window.sharejs.Connection(this.socket)
    this.doc = this.sjs.get('users-' + this.documentId, 'seph')

    this.bindSocketHandlers()

    this.auth().done(this.openDocument)
  }
  , getDocId: function () {
    return this.getDocIdFromHash() || _.random(10000000000)
  }
  , getDocIdFromHash: function () {
    return window.location.hash.replace('#', '')
  }
  /**
   * Simple auth.
   * @returns {jQuery.Deferred}
   */
  , auth : function () {
    var user = {
      title: window.prompt('Your name:')
    }

    this.__user = user

    return $.Deferred().resolve(user).promise()
  }

  /**
   * Create interface for document
   */
  , buildDocumentInterface : function (document) {
    var self = this

    this.Roster = new Team1.Roster()
    this.Editor = new Team1.Editor()

    this.doc.subscribe()

    this.doc.whenReady(function () {
      if (!self.doc.type) self.doc.create('text')

      if (self.doc.type && self.doc.type.name === 'text')
        self.doc.attachCodeMirror(self.Editor.codeEditor)
    })

    if (document.users)
      this.Roster.fillList(document.users)

    if (document.id)
      window.location.hash = '#' + document.id
  }

  , openDocument : function () {
    this.send(JSON.stringify(
      { a: 'open'
      , user: this.__user
      , document:
        { id: this.documentId
        }
      }
    ) )

    return this
  }

  , bindSocketHandlers : function () {
    this.doc.setOnOpenMessageFn(this.onSocketOpen)
    this.doc.setOnJoinMessageFn(this.onSocketJoin)
    this.doc.setOnCloseMessageFn(this.onSocketLeave)
    this.doc.setOnMetaMessageFn(this.onSocketMeta)
  }

  , send: function (message, callback) {
    var self = this

    this.waitForConnection(function () {
      self.socket.send(message)

      if (typeof callback !== 'undefined') {
        callback()
      }
    }, 1000)
  }

  , waitForConnection: function (callback, interval) {
    var that = this

    if (this.socket.readyState === 1)
    { callback()
    } else {
      setTimeout(function ()
        { that.waitForConnection(callback)
        }
        , interval);
    }
  }

  , onSocketJoin : function (data) {
    console.log('join:',data);
    this.Roster.add(data.user)
  }

  , onSocketLeave : function (data) {
    this.Roster.remove(data.user.id)
    this.Editor.removeCursor(data.user.id)
  }

  , onSocketOpen : function (data) {
    if (data.user)
      _.extend(this.__user, data.user)

    this.buildDocumentInterface(data.document || {})
  }

  , onSocketMeta : function (data) {
    this.Editor.updateCursor(
      { id: data.id
      , position : data.meta
      , color : 'red'
      }
    )
  }

  , getSocket : function () {
    return new WebSocket('ws://' + 'localhost' + ':7900')
  }
}

//wrong place for it.
$(document).ready(function () {
  Team1.start({
    socketUrl: 'http://127.0.0.1:7900'
  })
})
