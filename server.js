var nextrip = require('nextrip');
var express = require('express');

var app = express.createServer();

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});


app.get('/', function(req, res){
  res.send('Hello World');
});

app.get('/nextrip/:stopid', function(req, res){
  nextrip.getNextTrip(req.params.stopid, {}, function(departures) {
    res.send(departures);
  });
});

var port = process.env.PORT || 3000;
app.listen(port);