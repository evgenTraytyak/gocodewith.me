UsersController = {
  defaultSettings: function (req, res) {
    var userId = req.user._id

    User.findById(userId, function (err, user) {
      if (err) { console.error(err) }
      if (!user) {
        res.status(404).send('User not found!')
      } else {
        res.json(user.settingEditor)
      }
    })
  },

  saveFont: function (req, res) {
    var userId = req.user._id
      , fontName = req.body.name

    User.findByIdAndUpdate(userId, { '$set': { 'settingEditor.font': fontName } })
        .exec(function (err, user) {
          if (err) { console.error(err) }
          if (!user) {
            res.status(404).send('User not found!')
          } else {
            res.status(200).send()
          }
        })
  },

  saveFontSize: function (req, res) {
    var userId = req.user._id
      , fontSize = req.body.size

    User.findByIdAndUpdate(userId, { '$set': { 'settingEditor.fontSize': fontSize } })
        .exec(function (err, user) {
          if (err) { console.error(err) }
          if (!user) {
            res.status(404).send('User not found!')
          } else {
            res.status(200).send()
          }
        })
  },

  saveTheme: function (req, res) {
    var userId = req.user._id
      , themeName = req.body.name

    User.findByIdAndUpdate(userId, { '$set': { 'settingEditor.theme': themeName } })
        .exec(function (err, user) {
          if (err) { console.error(err) }
          if (!user) {
            res.status(404).send('User not found!')
          } else {
            res.status(200).send()
          }
        })
  }
}
