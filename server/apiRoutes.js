var whichController = require('./which/whichController.js');

module.exports = function (apiRouter) {

  /*     Routes beginning with /api/which

       See documentation at corresponding 
       function in whichController.js
  */
  apiRouter.get('/which', whichController.getNewestWhich);
  apiRouter.post('/which', whichController.createWhich);
  apiRouter.post('/which/:whichID/judge', whichController.judgeWhich);
  
  /*   For all dynamic routes containing a :whichID,
       before passing the request along to its handler
       create a whichID property on req.body containing that ID
  */
  apiRouter.param('whichID', function(req, res, next, whichID){
    req.body.whichID = whichID;
    next();
  })


  // TODO: implement getting which by id
  // apiRouter.get('/which/:whichID', function () {});
};