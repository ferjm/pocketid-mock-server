var express         = require('express');
var http            = require('http');
var WebSocketServer = require('ws').Server;

module.exports = (function() {
  var app = express();
  var server = http.createServer(app);
  var wss = new WebSocketServer({ server: server });

  // Configure.
  require('./config')(app);

  // API.
  require('./api')(app, wss);

  function run() {
    server.listen(app.get('port'), function() {
      console.log('Pocket ID fake server listening on port ' + app.get('port'));
    });
  }

  return {
    app: app,
    run: run
  };
})();
