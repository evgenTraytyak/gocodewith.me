var Team1 = Team1 || {}

Team1.Roster = function () {
  this.usersListEl = $(".roster-list")

  this.userTpl = _.template($("#user-tpl").html())

  this.add = function (user) {
    this.usersListEl.append(this.userTpl(user))
  }

  this.remove = function (id) {
    this.usersListEl.find("#" + id).remove()
  }

  this.fillList = function (usersList) {
    var _this = this

    _.forEach(usersList, function (user) {
      _this.add(user)
    })
  }

  this.addCurrentUser = function (user) {
    this.usersListEl.append($(this.userTpl(user)).addClass("current"))
  }

  return this;
}