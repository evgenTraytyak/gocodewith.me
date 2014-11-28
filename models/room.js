var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var RoomsSchema = new Schema(
  { name: { type: String, trim: true, required: true, unique: true }
  , created_at: { type: Date, default: Date.now()}
  , creator_id: { type: Schema.ObjectId, required: true, ref: 'User' }
  , user_ids: [{ type: Schema.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('Room', RoomsSchema)
