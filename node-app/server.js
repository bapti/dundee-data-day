var path = require('path'),
    express = require('express'),
    webpack = require('webpack'),
    config = require('./webpack-config'),
    Prometheus = require("prometheus-client"),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),

    app = express(),
    compiler = webpack(config),
    client = new Prometheus(),

    counter = client.newCounter({
      namespace: "dundee_data_day",
      name: "button_counter",
      help: "The number of times the button has been clicked"
    }),

    errorCounter = client.newCounter({
      namespace: "dundee_data_day",
      name: "error_counter",
      help: "The number of errors thrown"
    }),
    io;


app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/metrics", client.metricsFunc());

app.post("/feature", jsonParser, function(request, response){
    console.log("HITTING disable_feature", request.body);
    io.emit("disable_feature", request.body);
    response.end(request.body);
})

var server = app.listen(5000, function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:5000');
});

io = require('socket.io')(server);

var count = 0;

io.on('connection', function (socket) {
    socket.emit('count', { count: count } );

    socket.on('increment', function (data) {
        count++;
        console.log("increment count: " + count, data.version);
        socket.emit('count', {count: count});
        socket.broadcast.emit('count', {count: count});

        if( data.version == 1 ){
          counter.increment()
        }

        if( data.version == 2 && count % 5 == 0 ) {
          errorCounter.increment({feature: "counter_button", version: 2})
        }
    });
});
