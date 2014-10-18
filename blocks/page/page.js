var Team1 = Team1 || {};

Team1 = {
  stubUsers: [
    {
      id: 1
      , name: "Nike"
    }
    ,{
      id: 2
      , name: "Max"
    }
    ,{
      id: 3
      , name: "John"
    }
  ]
  , start : function (options) {
    _.bindAll(this);

    this.socket = this.getSocket(options.socketUrl)

    this.bindSocketHandlers()

    this.Roster = new Team1.Roster(this.stubUsers)
  }

  , bindSocketHandlers : function () {
    this.socket.on("open", this.onSocketOpen)

    this.socket.on("close", this.onSocketClose)
  }

  , onSocketClose : function (data) {
    console.log(data.username + " has left")
  }

  , onSocketOpen : function (data) {
    console.log(data.username + " has joined")
  }

  , getSocket: function (socketUrl) {
    return io.connect(socketUrl, { reconnect: false });
  }
}
