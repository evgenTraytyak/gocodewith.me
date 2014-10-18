var Team1 = Team1 || {};

Team1 = {
  stubUsers : [
    {
      id: 1
      , title: "Nike"
    }
    ,{
      id: 2
      , title: "Max"
    }
    ,{
      id: 3
      , title: "John"
    }
  ]
  , start : function (options) {
    _.bindAll(this);

    this.socket = this.getSocket(options.socketUrl)    

    this.bindSocketHandlers()

    this.Roster = new Team1.Roster()
  }

  , bindSocketHandlers : function () {
    this.socket.on("open", this.onSocketOpen)

    this.socket.on("join", this.onSocketJoin)

    this.socket.on("leave", this.onSocketLeave)
  }

  , onSocketJoin : function (data) {
    var data { user : {} } // fix for wrong data format
    this.Roster.add(data.user)
  }

  , onSocketLeave : function (data) {
    if(!data.user)
      return
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
}
