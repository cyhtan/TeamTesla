var whichController = require('./which/whichController.js');

module.exports = function (apiRouter) {

  /*     Routes beginning with /api/which

       See documentation at corresponding 
       function in whichController.js
  */
  apiRouter.get('/which', whichController.getNewestWhich);
  apiRouter.post('/which', whichController.createWhich);
  apiRouter.post('/which/:whichID/judge', whichController.judgeWhich);
  apiRouter.post('/which/:whichID/tag',   whichController.tagWhich);



  // TODO: implement getting which by id
  // apiRouter.get('/which/:whichID', function () {});


  apiRouter.get('/tag/:tagName', whichController.getWhichesByTag);


  
  /*   For all dynamic routes containing a :whichID or :tagName,
       before passing the request along to its handler
       create a property on req.body of the same name, 
       containing the dynamic value
  */
  apiRouter.param('tagName', function(req, res, next, tagName){
    req.body.tagName = tagName;
    next();
  })
  apiRouter.param('whichID', function(req, res, next, whichID){
    req.body.whichID = whichID;
    next();
  })
};