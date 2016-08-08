var bodyParser     = require('body-parser');
var errorHandler   = require('error-handler');
var express        = require('express');
var expressWinston = require('express-winston');
var winston        = require('winston');

var config = function(app) {
  app.set('port', process.env.PORT || 8080);
  
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  
  app.use(errorHandler);
  
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               req.headers["access-control-request-headers"]);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    next();
  });
  
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: false,
        colorize: true
      })
    ],
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}"
  }));
};

module.exports = config;
