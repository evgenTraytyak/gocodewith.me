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

  , start : function () {
    this.Roster = new Team1.Roster(this.stubUsers)
  }
}

$(document).ready(function () {
  Team1.start()
})
