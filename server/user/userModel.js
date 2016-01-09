var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  // _id:    mongo creates this
  username: String,
  password: String,
  judgedWhiches: Array,
  joinedOn : { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);