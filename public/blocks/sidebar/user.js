var App = App || {}

App.Users = function () {
  this.usersListEl = $(".sidebar__users")

  this.userTpl = _.template($("#user-tpl").html())
}

App.Users.prototype.add = function (user) {
  this.usersListEl.append(this.userTpl(user))
}

App.Users.prototype.remove = function (id) {
  this.usersListEl.find("#" + id).remove()
}

App.Users.prototype.fillList = function (usersList) {
  var _this = this

  _.forEach(usersList, function (user) {
    _this.add(user)
  })
}

App.Users.prototype.getUsersCount = function () {
  return $(".sidebar__users li").length;
}
