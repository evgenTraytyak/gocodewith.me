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
var Team1 = Team1 || {}

Team1.Roster = function (list) {
  var _this = this

  this.usersList = list

  this.usersListEl = $(".roster-list")

  this.userTpl = _.template($("#user-tpl").html())

  _.forEach(this.usersList, function (user) {
    _this.add(user)
  })
}


Team1.Roster.prototype.add = function (user) {
  this.usersListEl.append(this.userTpl(user))
}

Team1.Roster.prototype.remove = function (id) {
  this.usersListEl.find("#" + id).remove()
}