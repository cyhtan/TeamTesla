var mongoose = require('mongoose');

var WhichSchema = new mongoose.Schema({
  // _id:    mongo creates this
  question: String,
  createdBy: String, // username
  votesFrom: Array,
  tags: Array,
  type : String,
  thingA : String, // either string of text, or url to resource
  thingB : String,
  thingAVoteCount : {type: Number, default: 0},
  thingBVoteCount : {type: Number, default: 0},
  // lastVotedOn : { type: Date, default: Date.now },
  createdAt : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Which', WhichSchema);