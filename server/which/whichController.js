// this is where we talk to the database
var Which = require('./whichModel.js'),
    Q     = require('q');

module.exports = {
  // get oldest unseen which
  getOldestWhich : function (req, res, next) {

  },
  // create a new which
  createWhich : function (req, res, next) {
    // we don't care if there are duplicate whiches, right now, so we're not checking for that

    var buildWhich = Q.nbind(Which.create, Which);

    // THIS MIGHT BE WRONG
    var data = req.body;

    var newWhich = {
      // id:    mongo creates this?
      question: data.question,
      createdBy: data.createdBy,
      // votesFrom: Array,
      // tags: Array,
      type : data.type,
      thingA : data.thingA, // either string of text, or url to resource
      thingB : data.thingB
      // results : Object
    };

    buildWhich(newWhich).then(function(createdWhich){
      if (createdWhich) res.json(createdWhich);
    })
    .fail(function(err){
      next(error);
    });

  }
};