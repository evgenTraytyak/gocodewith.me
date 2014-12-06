var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UsersSchema = new Schema(
  { id: String
  , githubId: { type: String, unique: true, default: Date.now() }
  , username: { type: String, trim: true, required: true, unique: true }
  , email: { type: String, trim: true, required: true, unique: true }
  , password: { type: String }
  , settingEditor:
    { lightMode: { type: Boolean, default: true }
    , font: { type: String, default: 'Menlo'}
    , fontSize: { type: String, default: '13px'}
    , theme: { type: String, default: 'neo' }
    , modeEditing: { type: String, default: 'sublime' }
    , ternEngine: { type: Boolean, default: false }
    }
  })

User = mongoose.model('User', UsersSchema)

module.exports = User;
