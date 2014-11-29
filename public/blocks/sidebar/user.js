var App = App || {}

App.Users = function () {
  this.usersListEl = $(".sidebar__users")

  this.userTpl = _.template($("#user-tpl").html())
}

var UsersProto = App.Users.prototype = {}

UsersProto.add = function (user) {
  this.usersListEl.append(this.userTpl(user))
}

UsersProto.remove = function (id) {
  this.usersListEl.find("#" + id).remove()
}

UsersProto.fillList = function (usersList) {
  var _this = this

  _.forEach(usersList, function (user) {
    _this.add(user)
  })
}

UsersProto.getUsersCount = function () {
  return $(".sidebar__users li").length
}
