var App = App || {}
var Host = window.location.hostname + ':7900'

App = {
  start: function (options) {
    _.bindAll(this)

    this.documentId = this.getDocId()

    this.socket = this.getSocket(options.socketUrl)
    this.sjs = new window.sharejs.Connection(this.socket)
    this.doc = this.sjs.get('users-' + this.documentId, 'seph')

    this.bindSocketHandlers()

    this.__user = $('#user_meta').data('user-name')

    this.openDocument();
  }
  , getDocId: function () {
    return window.location.pathname.replace(/^\/room\/(.+)$/g, '$1')
  }

  /**
   * Create interface for document
   */
  , buildDocumentInterface: function (document) {
    var self = this

    this.Users = new App.Users()
    this.Editor = new App.Editor()

    this.doc.subscribe()

    this.doc.whenReady(function () {
      if (!self.doc.type) self.doc.create('text')

      if (self.doc.type && self.doc.type.name === 'text')
        self.doc.attachCodeMirror(self.Editor.codeEditor)
    })

    if (document.users)
      this.Users.fillList(document.users)

    if (document.id) {
      if (App.Users.getUsersCount() == 1) {
        this.loadDocument(document.id)
      }
    }
  }

  , openDocument: function () {
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

  , bindSocketHandlers: function () {
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
        , interval)
    }
  }

  , onSocketJoin: function (data) {
    this.Users.add(data.user)
  }

  , onSocketLeave: function (data) {
    this.Users.remove(data.user.id)
    this.Editor.removeCursor(data.user.id)
  }

  , onSocketOpen: function (data) {
    if (data.user)
      _.extend(this.__user, data.user)

    this.buildDocumentInterface(data.document || {})
  }

  , onSocketMeta : function (data) {
    this.Editor.updateCursor(
      { id: data.id
        , position : data.meta
        , color : data.color
      }
    )
  }

  , saveDocument: function () {
    var docContentObj = {
      operation: 'save'
      , docName: this.documentId
      , docContent: this.Editor.codeEditor.getValue()
    }

    $.ajax({ type: "POST"
      , url: window.location.pathname
      , data: JSON.stringify(docContentObj)
      , success: function(data) {
        console.log('success')
      }
      , fail: function() {
        console.log('error')
      }
    })
  }

  , loadDocument: function (docId) {
    var docContentObj = {
      operation: 'get'
      , docName: this.documentId
    }

    $.ajax({ type: "POST"
      , url: window.location.pathname
      , dataType: 'json'
      , data: JSON.stringify(docContentObj)
      , success: function (doc) {
        console.log('success')
        console.log(doc.value);
        if (doc !== null) {
          App.Editor.codeEditor.getDoc().setValue(doc.value)
        }
      }
      , fail: function() {
        console.log('error')
      }
    })
  }

  , getSocket : function () {
    return new WebSocket('ws://' + Host)
  }
}

$(document).ready(function () {
  App.start({
    socketUrl: 'http://' + Host
  })
})

window.onbeforeunload = function () {
  if (App.Users.getUsersCount() == 1) {
    App.saveDocument()
  }
}

window.onunload = function () {
  if (App.Users.getUsersCount() == 1) {
    App.saveDocument()
  }
}
