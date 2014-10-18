function Roster() {
  var _this = this;

  this.users = [
    {
      name: 'Nike'
    }
    ,{
      name: 'Max'
    }
    ,{
      name: 'John'
    }
  ]

  this.usersListEl = $('.roster-list');
  this.userTpl = _.template('<li class="roster-item"><%= name %></li>');

  _.forEach(this.users, function(user) {
    _this.add(user);
  });
}

Roster.prototype.add = function(user) {
  this.usersListEl.append(this.userTpl(user));
}

new Roster;




