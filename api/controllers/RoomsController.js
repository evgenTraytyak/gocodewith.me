RoomsController = {
  show: function (req, res) {
    var callbacks = {
      success: function (room) {
        RoomsController._showItem(req, res, room)
      },
      empty: function (name) {
        req.flash('message', 'Room ' + name +' doesn\'t exist')
        res.status(404).redirect('/')
      },
      error: function () {
        res.status(500).redirect('/')
      }
    }

    RoomsController._isExistByName(req.params.name, 'show', callbacks)
  },

  create: function (req, res) {
    var callbacks = {
      success: function (room) {
        res.redirect('/room/' + room.name)
      },
      empty: function () {
        var callbacks = {
          error: function () {

          },
          success: function (room) {
            res.redirect('/room/' + room.name)
          }
        }

        RoomsController._createItem(req, callbacks)
      },
      error: function () {
        res.status(500).send()
      },
      exist: function (name) {
        req.flash('message', 'Room ' + name +' already exist')
        res.status(404).redirect('/')
      }
    }

    RoomsController._isExistByName(req.body.name, 'create', callbacks)
  },

  _createItem: function (req, callbacks) {
    var room = new Room({
      name: req.body.name,
      creator_id: req.user,
      user_ids: [req.user._id]
    })

    room.save(function (err, room) {
      if (err) {
        if (callbacks.error) callbacks.error()
      }
      else {
        if (callbacks.success) callbacks.success(room)
      }
    })
  },

  _showItem: function (req, res, room) {
    var syntaxesPath = path.join(dir_root, 'public/codelanguages/', 'languages.json')
      , syntaxes = JSON.parse(fs.readFileSync(syntaxesPath, 'utf8'))

      , fontsPath = path.join(dir_root, 'public/fonts/', 'fonts.json')
      , fonts = JSON.parse(fs.readFileSync(fontsPath, 'utf8'))

      , themesPath = path.join(dir_root, 'public/themes/', 'themes.json')
      , themes = JSON.parse(fs.readFileSync(themesPath, 'utf8')).themes

    getUsersInRoom(req, room, function (users) {
      res.render('index',
      { user: req.user
      , users: users
      , fonts: fonts
      , themes: themes
      , syntaxes: syntaxes
      , settings:
        { syntaxName: room.settings.syntax.name
        , syntaxMode: room.settings.syntax.mode
        , font: req.user.settingEditor.font
        , fontSize: req.user.settingEditor.fontSize
        , theme: req.user.settingEditor.theme
        }
      , message: req.flash('message')
      })
    })

    var callback = addUserToRoom
    userExistInRoom(req, room, callback)
  },

  _isExistByName: function (name, action, callback) {
    Room.findOne({'name': name}).exec(function (err, room) {
      if (err) {
        if (callback.error) callback.error()
      }
      else if (!room) {
        if (callback.empty) callback.empty(name)
      }
      else {
        if (action == 'show') {
          callback.success(room)
        } else if (action == 'create') {
          callback.exist(name)
        }
      }
    })
  },

  saveSyntax: function (req, res) {
    var roomName = req.body.name
      , syntaxName = req.body.syntaxName
      , syntaxMode = req.body.syntaxMode
      , query = { 'name': roomName }
      , options = { '$set': { 'settings.syntax.name': syntaxName
                            , 'settings.syntax.mode': syntaxMode
                            }
                  }

    Room.findOneAndUpdate(query, options, function (err, room) {
      if (err) { console.error(err) }
      if (!room) {
        res.status(404).send('Room not found!')
      }
      else {
        res.status(200)
      }
    })
  },

  defaultSettings: function (req, res) {
    var roomName = req.query.name

    Room.findOne({'name': roomName}).exec(function (err, room) {
      if (err) { console.error(err) }
      if (!room) {
        res.status(404).send('Room not found!')
      }
      else {
        res.send(room.settings)
      }
    })
  }

};

var addUserToRoom = function (req, room) {
  var query = { 'name': room.name }
    , options = { '$push': { user_ids: req.user._id } }

  Room.findOneAndUpdate(query, options, function (err, room) {
    if (err) { console.log(err) }

    if (!room) {
      //res.status(400)
      console.log('Room'.red, room.name.yellow.bold ,'not found'.red)
    } else {
      console.log('User'.green, req.user.username.yellow.bold ,'has been successfully added to the room'.green)
    }
  })
}

var getUsersInRoom = function (req, room, callback) {
  Room.findOne({name: room.name}).populate('user_ids').exec(function (err, foundRoom) {
    var users_username = []

    foundRoom.user_ids.forEach(function (user, index) {
      users_username.push(user.username)
    })
    console.log(users_username)

    callback(users_username);
  })
}

var userExistInRoom = function (req, room, callback) {
  Room.findOne({name: room.name}).populate('user_ids').exec(function (err, foundRoom) {
    var i = 0
      , length = foundRoom.user_ids.length
      , needAdd = false

    for (; i < length; i++) {
      var user = foundRoom.user_ids[i]

      if (user.username == req.user.username) {
        console.log('User'.red, user.username.yellow.bold ,'already exists in the room'.red)
        needAdd = false
        break
      } else {
        needAdd = true
      }
    }
    if (needAdd) {
      callback(req, room)
    }


  })
}
