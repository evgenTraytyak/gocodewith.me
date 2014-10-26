var Team1 = Team1 || {};

Team1 = {
  start : function (options) {
    _.bindAll(this);

    this.socket = this.getSocket(options.socketUrl)

    this.bindSocketHandlers()

    this.Roster = new Team1.Roster()
  }

  /**
   * Simple auth.
   * @returns {jQuery.Deferred}
   */
  , auth : function () {
    return jQuery.Deferred().resolve({
      title: window.prompt('Your name:')
    })
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
    if (data.document && data.document.users) {
      this.Roster.fillList(data.document.users)
    }
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
