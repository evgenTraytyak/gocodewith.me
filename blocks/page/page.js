var Team1 = Team1 || {};

Team1 = {
  start : function (options) {
    _.bindAll(this);
    this.socket = this.getSocket(options.socketUrl)
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
    return jQuery.Deferred().resolve(user).promise()
  }

  /**
   * Create interface for document
   */
  , buildDocumentInterface : function (document) {
    this.Roster = new Team1.Roster()
    if (document.users)
      this.Roster.fillList(document.users)
    if (document.id)
      location.hash = "#" + document.id
  }

  /**
   * Init document
   */
  , openDocument : function () {
    this.socket.emit('open', {
      user : this.__user,
      document : {
        id : location.hash.replace("#", "") || null
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

  , getSocket : function (socketUrl) {
    return io.connect(socketUrl, { reconnect: false })
  }
}

$(document).ready(function () {
  Team1.start({
    socketUrl: 'http://127.0.0.1:7900'
  })
})
