UsersController = {
  defaultSettings: function (req, res) {
    var userId = req.user._id

    User.findById(userId, function (err, user) {
      if (err) { console.error(err) }
      if (!user) {
        res.status(500).send('Database: User not found!')
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
            res.status(500).send('Database: User not found!')
          } else {
            res.status(200).send()
          }
    })
  },

  saveFontSize: function (req, res) {

  },

  saveTheme: function (req, res) {

  }

}
