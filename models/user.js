var mongoose = require('mongoose')

module.exports = mongoose.model('User',
  { id: String
  , username: String
  , email: String
  , password: String
  , settingEditor:
    { lightMode: Boolean
    , theme: String
    , modeEditing: String
    , ternEngine: Boolean
    }
  })
