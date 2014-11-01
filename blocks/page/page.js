var Team1 = Team1 || {};

Team1 = {
  start : function (options) {
    _.bindAll(this);
    this.socket = this.getSocket(options.socketUrl)
    this.sjs = new window.sharejs.Connection(this.socket);
    this.bindSocketHandlers()
    this.auth().done(this.openDocument)
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
    this.Roster = new Team1.Roster()
    this.Editor = new Team1.Editor()

    var doc = this.sjs.get('users', 'seph')
    doc.subscribe()
    doc.whenReady(function () {
      if (!doc.type) doc.create('text');
      if (doc.type && doc.type.name === 'text')
        doc.attachCodeMirror(this.Editor.codeEditor)
    })

    if (document.users)
      this.Roster.fillList(document.users)
    if (document.id)
      window.location.hash = '#' + document.id
  }

  /**
   * Init document
   */
  , openDocument : function () {
    this.socket.emit('open', {
      user : this.__user,
      document : {
        id : window.location.hash.replace('#', '') || null
      }
    })
    return this
  }

  , bindSocketHandlers : function () {
    this.socket.on('open', this.onSocketOpen)

    this.socket.on('join', this.onSocketJoin)

    this.socket.on('leave', this.onSocketLeave)
  }

  , onSocketJoin : function (data) {
    this.Roster.add(data.user)
  }

  , onSocketLeave : function (data) {
    this.Roster.remove(data.user.id)
  }

  , onSocketOpen : function (data) {
    if (data.user)
      _.extend(this.__user, data.user)
    this.buildDocumentInterface(data.document || {})
  }

  , getSocket : function () {
    return new WebSocket('ws://' + window.location.host + ':7900')
  }
}

//wrong place for it.
$(document).ready(function () {
  Team1.start({
    socketUrl: 'http://127.0.0.1:7900'
  })
})
