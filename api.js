var nodemailer = require('nodemailer');
var uuid       = require('node-uuid');

module.exports = function(app, wss) {
  var wsClients = {};

  wss.on('connection', function connection(ws) {
    var userid = ws.upgradeReq.url.replace('/', '').split('?')[0];    
    console.log('WebSockets connection for ' + userid);

    if (!userid || !wsClients[userid]) {
      console.log('Invalid user id. Closing ws connection');
      ws.close();
      return;
    }

    wsClients[userid].ws = ws;
  });

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'project.pocket.id@gmail.com',
      pass: 'eddystone'
    }
  });

  app.post('/register', function(req, res) {
    console.log('POST /register with ' + req.body.username);
    if (!req.body.username) {
      return res.status(400).json('Missing email');
    }

    var userid = uuid.v1();
    console.log('User id ' + userid);

    wsClients[userid] = {
      username: req.body.username
    };

    var host = req.get('host');

    var fullUrl = req.protocol + '://' + host;

    var text = fullUrl + '/verify?id=' + userid;
    var mailOptions = {
      from: 'ferjmoreno@gmail.com',
      to: req.body.username,
      subject: 'Hello from PocketID',
      text: text
    };
  
    var ws = 'ws://' + host + '/' + userid;
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        console.log('Email sent');
        res.status(200).json({
          ws: ws
        });
      }
    });
  });

  app.get('/verify', function(req, res) {
    var id = req.query.id;
    if (!id || !wsClients[id] || !wsClients[id].ws) {
      return res.status(400).json('Invalid request');
    }
    wsClients[id].ws.send('verified');
    res.status(200).json('verified');
  });
};
