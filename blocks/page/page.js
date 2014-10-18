var Team1 = Team1 || {};

Team1 = {
  stubUsers: [
    {
      name: "Nike"
    }
    ,{
      name: "Max"
    }
    ,{
      name: "John"
    }
  ]

  , start : function () {
    this.Roster = new Team1.Roster(this.stubUsers)
  }
}

$(document).ready(function () {
  Team1.start()
})
