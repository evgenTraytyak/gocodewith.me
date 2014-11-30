var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UsersSchema = new Schema(
  { id: String
  , username: { type: String, trim: true, required: true, unique: true }
  , email: { type: String, trim: true, required: true, unique: true }
  , password: { type: String, required: true }
  , settingEditor:
    { lightMode: { type: Boolean, default: false }
    , theme: { type: String, default: 'ocean dark' }
    , modeEditing: { type: String, default: 'sublime' }
    , ternEngine: { type: Boolean, default: false }
    }
  })

User = mongoose.model('User', UsersSchema)

module.exports = User;
