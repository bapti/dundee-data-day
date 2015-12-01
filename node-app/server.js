(function () {
    'use strict';

    var path = require('path'),
        express = require('express'),
        webpack = require('webpack'),
        config = require('./webpack-config'),
        Prometheus = require("prometheus-client"),

        app = express(),
        compiler = webpack(config),
        client = new Prometheus(),

        counter = client.newCounter({
            namespace: "dundee_data_day",
            name: "button_counter",
            help: "The number of times the button has been clicked"
        });

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    app.get("/metrics", client.metricsFunc());

    var server = app.listen(5000, function (err) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Listening at http://localhost:5000');
    });

    var io = require('socket.io')(server);

    var count = 0;

    io.on('connection', function (socket) {
        socket.emit('count', {count: count});

        socket.on('increment', function (version) {
            count++;
            console.log("increment count: " + count, version);
            socket.emit('count', {count: count});
            socket.broadcast.emit('count', {count: count});
            counter.increment({version: version});
        });
    });
})();
