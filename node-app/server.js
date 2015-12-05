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

    featureCounter = client.newCounter({
        namespace: "dundee_data_day",
        name: "feature_counter",
        help: "This counter increments every times a feature is invoked on the page."
    }),

    connectionCounter = client.newCounter({
        namespace: "dundee_data_day",
        name: "connection_counter",
        help: "This counter increments every time a socket event or endpoint is hit."
    }),
    io;


app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.get('/', function (req, res) {
    connectionCounter.increment({type:"api", endpoint: "/"});
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/metrics", client.metricsFunc());

app.post("/feature", jsonParser, function (request, response) {
    console.log("HITTING /feature", request.body);

    connectionCounter.increment({type:"api",endpoint: "/feature"});
    featureState = request.body;
    if (request.body.alert) {
        console.log(request.body.alert[0].payload);
    }
    io.emit("set_feature_state", request.body);
    response.end();
});

var server = app.listen(5000, function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:5000');
});

io = require('socket.io')(server);

var count = 0,
    featureState = [];

io.on('connection', function (socket) {

    connectionCounter.increment({type:"socket",endpoint: "connection"});
    socket.emit('count', {count: count});
    socket.emit("set_feature_state", featureState);

    socket.on('increment', function (data) {
        count++;
        console.log("increment count: " + count, data.version);
        io.emit('count', {count: count});

        if (data.version == 1) {
            featureCounter.increment({feature: "counter_button", version: 1, code: "OK"});
        }

        if (data.version == 2) {
            if (count % 5 === 0) {
                featureCounter.increment({feature: "counter_button", version: 2, code: "ERROR"});
            } else {
                featureCounter.increment({feature: "counter_button", version: 2, code: "OK"});
            }
        }

        connectionCounter.increment({type:"socket",endpoint: "increment"});
    });
});


