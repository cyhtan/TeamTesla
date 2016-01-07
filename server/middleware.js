var morgan     = require('morgan'),
    bodyParser = require('body-parser');

// we passed in app and express from server.js
module.exports = function (app, express){



  // morgan is a console logger, 'dev' means developer mode...  copied in from Shortly Angular
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded( {extended:true} ));
  app.use(bodyParser.json());

  // serve static assets?
  // app.use(express.static(__dirname + '/..'));


};