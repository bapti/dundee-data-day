var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack-config');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var server = app.listen(3000, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});

var io = require('socket.io')(server)

var count = 0

io.on('connection', function (socket) {
  socket.emit('count', { count: count });

  socket.on('increment', function (data) {
    count++
    console.log("increment count: " + count);
    socket.emit('count', { count: count });
    socket.broadcast.emit('count', { count: count });
  });
});
