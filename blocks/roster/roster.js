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
