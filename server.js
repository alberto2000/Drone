// global console.log shortcut
GLOBAL.log = console.log.bind(console);

// global ardrone objects
GLOBAL.arDrone = require('ar-drone');
GLOBAL.client = arDrone.createClient();

// create server
var express = require('express');
var app = express();
var server = app.listen(8888);

app.use(express.static('public'));

// create io object
GLOBAL.io = require('socket.io').listen(server);

// router
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

GLOBAL.Drone = require('./server/drone.js');
GLOBAL.IO = require('./server/io.js');
GLOBAL.OSC = require('./server/osc.js');
GLOBAL.Video = require('./server/video.js');
GLOBAL.Show = require('./server/show.js');

Drone.init();
IO.init();
OSC.init();
// Video.init();