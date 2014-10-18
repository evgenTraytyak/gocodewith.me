var Team1 = Team1 || {};

Team1 = {
  stubData :
    { usersList:
      [ { id: 1
        , title: 'Nike'
        }
      , { id: 2
        , title: 'Max'
        }
      , { id: 3
        , title: 'John'
        }
      ]
    , user:
      { id: 123
      , title: 'title'
      }
    , document:
    { id: 123
    }
  }
  , start : function (options) {
    _.bindAll(this);

    this.socket = this.getSocket(options.socketUrl)

    this.bindSocketHandlers()

    this.Roster = new Team1.Roster()
  }

  , bindSocketHandlers : function () {
    this.socket.on('open', this.onSocketOpen)

    this.socket.on('join', this.onSocketJoin)

    this.socket.on('leave', this.onSocketLeave)
  }

  , onSocketJoin : function (data) {
    this.Roster.add(data)
  }

  , onSocketLeave : function (data) {
    this.Roster.remove(data.user.id)
  }

  , onSocketOpen : function (data) {
    if (data.user) {
      this.Roster.addCurrentUser(data.user)
    }
    if (data.usersList !== null) {
      this.Roster.fillList(data.usersList)
    }
  }

  , getSocket : function (socketUrl) {
    return io.connect(socketUrl, { reconnect: false })
  }
  , triggerOpenEvent : function () {
    this.onSocketOpen(this.stubData)
  }
  , triggerJoin : function () {
    this.onSocketJoin({title: 'test title', id: 123});
  }
  , triggerLeave : function () {
    this.onSocketLeave({user: {id: 123}})
  }
}

$(document).ready(function () {
  Team1.start({
    socketUrl: 'http://127.0.0.1:7900'
  })
})
