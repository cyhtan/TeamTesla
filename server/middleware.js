var morgan     = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors');

// we passed in app and express from server.js
module.exports = function (app, express){

  var apiRouter = express.Router();

  // morgan is a console logger, 'dev' means developer mode...  copied in from Shortly Angular
  app.use(morgan('dev'));
  app.use(cors());
  app.use(bodyParser.urlencoded( {extended:true} ));
  app.use(bodyParser.json());

  // serve static assets?
  // this line is telling Express to serve static objects from the .. dir, but to make them actually seem like they're coming from the top level
  // app.use(express.static(__dirname + '/..'));

  app.use('/api', apiRouter);
  require('./apiRoutes.js')(apiRouter);

};
