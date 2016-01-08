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
      thingA : data.thingA, // either string of text, or url tot resource
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
    // TODO: append username to votesFrom
    var username = req.body.username;

    var updateCommand = { $inc: {} }; // $inc is a Mongo increment command
    updateCommand.$inc['thing'+ choice + 'VoteCount'] = 1;

    Which.findOneAndUpdate({_id: whichID}, updateCommand, {new:true}) // include updated values in dbResults
      .exec(function(err, dbResults){
        if (err) throw err;
        else {
          var clientResults = {
            votesForA: dbResults.thingAVoteCount,
            votesForB: dbResults.thingBVoteCount
          }
          res.json(clientResults);
        }
      });
  },


  /*        Route Handler - POST /api/which/:id/tag

        * Expects an object with a property tag.
          Expects tag to be a string that does not contain spaces.
        * Responds with a JSON object containing a tagNames
          property. tagNames is an array containing all tags
          the Which currently has
  */
  tagWhich : function (req, res, next) {
    var whichID  = req.body.whichID;
    var tag      = req.body.tag;

    var updateCommand = { $addToSet: {"tags": tag} }; // $addToSet will not add the value if it already exists

    Which.findByIdAndUpdate(whichID,updateCommand, {new:true}) // include updated values in dbResults
      .exec(function(err, dbResults){
        if (err) throw err;
        else {
          var clientResults = {tagNames: dbResults.tags};
          res.json(clientResults);
        }
      });
  },


  /*        Route Handler - GET /api/tag/:tagName

        * Expects no incoming data
        * Responds with JSON containing an array of
          Whiches that contain tagName in their tags array
  */
  getWhichesByTag : function (req, res, next) {
    var tag = req.body.tagName;
    Which.find({tags: tag})
      .exec(function(err, dbResults){
        if (err) throw err;
        else {
          res.json(dbResults);
        }
      });
  }




/*
  // This function has been factored out, but may be used in the future
  // as a route handler for GET /api/which/:id
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