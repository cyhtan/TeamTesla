var Which = require('./whichModel.js'),
    Q     = require('q');

module.exports = {
  // TODO: Once users have been implemented,
  //       complete this function and use it to
  //       retrieve the oldest, >_unseen_< Which for
  //       that user. 
  //       Finally, make this the new route handler
  //       for GET /api/which
  getOldestWhich : function (req, res, next) {

  },  

  
  /*        Route Handler - GET /api/which/  

        * Expects no incoming data
        * Responds with JSON containing the Which
          with the most recent createdAt value
  */
  getNewestWhich : function (req, res, next) {
    var findAllWhich = Q.nbind(Which.find, Which);
    findAllWhich({})
      .then(function(whiches){
        var newestWhich = whiches.reduce(function(memo, curWhich){
          if ( memo.createdAt < curWhich.createdAt ) return curWhich;
          else return memo;
        });
        res.json(newestWhich);
      })
      .fail(function(err){
        next(err);
      });
  },


  /*        Route Handler - POST /api/which/  

        * Expects a Which object with properties enumerated
          in newWhich below
        * Responds with JSON containing the newly created 
          Which object
  */
  createWhich : function (req, res, next) {
    var saveWhich = Q.nbind(Which.create, Which);
    var data = req.body;

    var newWhich = {
      question: data.question,
      createdBy: data.createdBy, // username
      tags: data.tags,
      type : data.type,
      thingA : data.thingA, // either string of text, or url to resource
      thingB : data.thingB
    };

    saveWhich(newWhich).then(function(createdWhich){
      if (createdWhich) res.json(createdWhich);
    })
    .fail(function(err){
      next(err);
    });
  },


  /*        Route Handler - POST /api/which/:id/judge   

        * Expects an object with the properties username
          and choice. Expects choice to be the string 'A' or 'B'
        * Responds with JSON containing the current vote
          counts for the Which choices
  */
  judgeWhich : function (req, res, next) {

    var whichID  = req.body.whichID;
    var choice   = req.body.choice.toUpperCase();
    var username = req.body.username;

    var updateCommand = { $inc: {} };
    updateCommand.$inc['thing'+ choice + 'VoteCount'] = 1;

    Which.findOneAndUpdate({_id: whichID}, updateCommand)
      .exec(function(err, dbResults){
        if (err) throw err;
        else {
          var clientResults = {
            votesForA: dbResults.thingAVoteCount,
            votesForB: dbResults.thingBVoteCount
          }
          // Oddly, results from Mongo are not up-to-date with the user's own vote
          clientResults['votesFor'+choice]++;
          res.json(clientResults);
        }
      });
  },

/*
  // This function has been factored out, but may be used in the future
  getWhichByID: function (req, res, next, whichID) {
    var findWhich = Q.nbind(Which.findOne, Which);
    findWhich({_id: whichID})
      .then(function (foundWhich){
        if (foundWhich) {
          // we intercepted the call to which/ID/judge, and now we're changing the req.body so we have this data going forward in the program
          req.body.foundWhich = foundWhich;
          next();
        } else {
          res.send(404); // TODO: handle this better
        }
      });
  }
*/
};