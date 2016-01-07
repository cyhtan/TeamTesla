// this comes from middleware.js
module.exports = function (apiRouter) {

  // /api/which
  apiRouter.get('/which', function () {});
  apiRouter.post('/which', function () {});

  // TODO: implement getting which by id
  // apiRouter.get('/which/:id', function () {});

  apiRouter.post('/which/:id/judge', function () {});


};