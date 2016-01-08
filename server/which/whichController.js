// this is where we talk to the database
var Which = require('./whichModel.js'),
    Q     = require('q');

module.exports = {
  // get oldest unseen which
  getOldestWhich : function (req, res, next) {

  },  // get a fresh Which, for development checking
  getNewestWhich : function (req, res, next) {
    var findAllWhich = Q.nbind(Which.find, Which);
    findAllWhich({})
      .then(function(whiches){

        console.log('1 whiches:', whiches);

        // find the most recent which
        return whiches.reduce(function(memo, curWhich){
          if ( memo.createdAt < curWhich.createdAt ) {
            return curWhich;
          } else {
            return memo;
          }
        });

      })
      .then(function(newestWhich){
        console.log('2 newestWhich:', newestWhich);
        res.json(newestWhich);
      })
      .fail(function(err){
        next(err);
      });

  },
  // create a new which
  createWhich : function (req, res, next) {
    // we don't care if there are duplicate whiches, right now, so we're not checking for that

    var buildWhich = Q.nbind(Which.create, Which);

    // THIS MIGHT BE WRONG
    var data = req.body;
    console.log('req.body: ',data);

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
      next(err);
    });

  }
};