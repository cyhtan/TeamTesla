var whichController = require('./which/whichController.js');

// this comes from middleware.js
module.exports = function (apiRouter) {

  apiRouter.param('whichID', function(req, res, next, whichID){
    req.body.whichID = whichID;
    next();
  })

  // reaches into the database and comes back with a which object
  // FOR DEVELOPMENT is getNewestWhich, otherwise getOldestWhich
  apiRouter.get('/which', whichController.getNewestWhich);
  // reaches into the database and places a new which object in it
  apiRouter.post('/which', whichController.createWhich);

  // TODO: implement getting which by id
  // apiRouter.get('/which/:id', function () {});

  // reaches into the database to get the which in question, then calls a function on it
  // in this case the function is "judge it"
  apiRouter.post('/which/:whichID/judge', whichController.judgeWhich);


};