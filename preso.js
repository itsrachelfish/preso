var express = require('express'),
    app     = require('express')(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    five = require("johnny-five"),
    users   = 0,
    slide   = 1,
    board, sensor;

server.listen(1337);


// Create routes for static content and the index
app.use(express.static(__dirname + '/static'));
app.get('/', function (req, res)
{
  res.sendfile(__dirname + '/index.html');
});


// Websocket magic
io.sockets.on('connection', function (socket)
{
    users++;

    // Notify other clients of the new user
    io.sockets.emit('users', {count: users});

    // Let the new user know they're connected
    socket.emit('status', {message: "Connected"});
    socket.emit('slide', {number: slide, name: "new"});

    var lastPing;
    var pingInterval = setInterval(function()
    {
        socket.emit('ping', {ping: new Date().getTime(), last: lastPing});
    }, 1000);

    socket.on('pong', function(time)
    {
        lastPing = (new Date().getTime() - time.ping) / 2;
    });

    socket.on('disconnect', function ()
    {
        clearInterval(pingInterval);
        users--;
        
        io.sockets.emit('users', {users: users});
    });
});

board = new five.Board();

board.on("ready", function()
{
    prevSensor = new five.Sensor({
        pin: "A0",
        freq: 100
      });

    nextSensor = new five.Sensor({
        pin: "A1",
        freq: 100
    });

    board.repl.inject({sensor: sensor});

    var trigger = new Date();
    var handleSensor = function(sensor)
    {
        // Only send data over the socket ever 250ms
        if(sensor.value > 500 && new Date() - trigger > 250)
        {            
            if(sensor.name == 'previous') {
                if(slide > 0) slide--;
            }
            else if(sensor.name == 'next') {
                slide++;
            }
            
            trigger = new Date();
            io.sockets.emit('slide', {number: slide, type: sensor.name});
            console.log(slide, sensor.name, sensor.value);
        }
    }

    prevSensor.on("data", function()
    {
        handleSensor({name: 'previous', value: this.raw});
    });

    nextSensor.on("data", function()
    {
        handleSensor({name: 'next', value: this.raw});
    });
});
