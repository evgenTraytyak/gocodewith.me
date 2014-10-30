var Team1 = Team1 || {}

Team1.Roster = function () {
  var usersListEl = $(".roster-list")
    , userTpl = _.template($("#user-tpl").html());

  this.add = function (user) {
    usersListEl.append(userTpl(user))
  }

  this.remove = function (id) {
    usersListEl.find("#" + id).remove()
  }

  this.fillList = function (usersList) {
    var _this = this

    _.forEach(usersList, function (user) {
      _this.add(user)
    })
  }

  this.addCurrentUser = function (user) {
    usersListEl.append($(userTpl(user)).addClass("current"))
  }

  return this
}
