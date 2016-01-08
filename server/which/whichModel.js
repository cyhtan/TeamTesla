// this is...  basically the database

var mongoose = require('mongoose');

var WhichSchema = new mongoose.Schema({
  // id:    mongo creates this?
  question: String,
  createdBy: String,
  // votesFrom: Array,
  // tags: Array,
  type : String,
  thingA : String, // either string of text, or url to resource
  thingB : String,
  // results : Object
  createdAt : { type: Date, default: Date.now }
});

// we think this means:  we have created a table called Which and mongoose is maintaining a connection to it
module.exports = mongoose.model('Which', WhichSchema);