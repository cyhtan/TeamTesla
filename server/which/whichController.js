var Which = require('./whichModel.js'),
    Q     = require('q');
/*
// TODO: abstract the dbResults -> clientResults
// property selection process into this function
var selectClientProps = function () {

};
*/

module.exports = {

  /*        Route Handler - GET /api/which

        * Expects an username parameter in the query string
        * Responds with the oldest Which, not yet judged
          by the user.
  */
  getOldestWhich : function (req, res, next) {
    var username = req.query.username;

    // Note: no query logic here to find the Oldest Which.
    // Mongo seems to be storing the Whiches in the order they
    // were created, and findOne is returning the first.
    var query = { votesFrom: {$ne: username} };

    Which.findOne(query)
      .then(function(oldestWhich){
        res.json(oldestWhich);
      })
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
        * If successful, responds with JSON containing 
          the current vote counts for both Which choices.
          Sends 409 if the ID is invalid, or the user already judged
  */
  judgeWhich : function (req, res, next) {
    var whichID  = req.body.whichID;
    var choice   = req.body.choice.toUpperCase();
    var username = req.body.username;

    // Find one Which by ID, but only if the user has not previously judged it 
    var query = {_id: whichID, votesFrom: {$ne: username} };

    // If found, increment appropriate VoteCount property, and push user to votesFrom
    var updateCommand = { $inc: {}, $push: {votesFrom: username} };
    updateCommand.$inc['thing'+ choice + 'VoteCount'] = 1;

    Which.findOneAndUpdate(query, updateCommand, {new:true}) // include updated values in dbResults
      .exec(function(err, dbResults){
        if (err) throw err;
        else if (!dbResults) res.send(409) // invalid whichID or user already judged
        else {
          var clientResults = {
            votesForA: dbResults.thingAVoteCount,
            votesForB: dbResults.thingBVoteCount,
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
          console.log(dbResults);
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
  },


  /*        Route Handler - GET /api/tag/:tagName/newest

        * Expects no incoming data
        * Responds with JSON containing the most recently
          created Which whose tags array contains tagName
  */
  getNewestWhichByTag : function (req, res, next) {
    console.log('cool');
    var tag = req.body.tagName;
    // TODO: refactor out the reduce below and let Mongo find newest
    Which.find({tags: tag})
      .exec(function(err, dbResults){
        if (err) throw err;
        else if (!dbResults.length) res.json(dbResults);
        else {
          var newestWhich = dbResults.reduce(function(memo, curWhich){
            if ( memo.createdAt < curWhich.createdAt ) return curWhich;
            else return memo;
          });

          var clientResults = {
            id: newestWhich._id,
            question: newestWhich.question,
            tags: newestWhich.tags,
            thingA: newestWhich.thingA,
            thingB: newestWhich.thingB
          }
          res.json(clientResults);
        }
      });
  }





/* - - - - - FUNCTIONS BELOW TEMPORARILY FACTORED OUT - - - - - 


          OLD DEV Route Handler for GET /api/which/

      * Expects no incoming data
      * Responds with JSON containing the Which
        with the most recent createdAt value

getNewestWhich : function (req, res, next) {
  var username = req.query.username;
  var findAllWhich = Q.nbind(Which.find, Which);
  findAllWhich({})
    .then(function(whiches){
      var newestWhich = whiches.reduce(function(memo, curWhich){
        if ( memo.createdAt < curWhich.createdAt ) return curWhich;
        else return memo;
      });

      var clientResults = {
        id: newestWhich._id,
        question: newestWhich.question,
        thingA: newestWhich.thingA,
        thingB: newestWhich.thingB
      }
      res.json(clientResults);
    })
    .fail(function(err){
      next(err);
    });
},


  // TODO: reimplement as a route handler for GET /api/which/:id
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
