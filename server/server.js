var express  = require('express'),
    mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/testdb');

require('./middleware.js')(app, express);

var port = process.env.PORT || 5007;
 // process.env.PORT = 4568
// app.set('port', (process.env.PORT || 4568));

app.listen(port, function(){
  console.log('Server now listening on port ' + port);
});

module.exports = app;
