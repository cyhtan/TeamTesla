var express = require('express');

var app = express();

require('./middleware.js')(app, express);

var port = process.env.PORT || 5007;
 // process.env.PORT = 4568
// app.set('port', (process.env.PORT || 4568));

app.listen(port, function(){
  console.log('Server now listening on port ' + port);
});

module.exports = app;