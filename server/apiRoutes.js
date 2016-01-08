var whichController = require('./which/whichController.js');

// this comes from middleware.js
module.exports = function (apiRouter) {

  // reaches into the database and comes back with a which object
  // FOR DEVELOPMENT is getNewestWhich, otherwise getOldestWhich
  apiRouter.get('/which', whichController.getNewestWhich);
  // reaches into the database and places a new which object in it
  apiRouter.post('/which', whichController.createWhich);

  // TODO: implement getting which by id
  // apiRouter.get('/which/:id', function () {});

  // updates the database with the results of a vote
  apiRouter.post('/which/:id/judge', function () {});


};