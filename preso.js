var express = require('express'),
    app     = require('express')(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    five = require("johnny-five"),
    users   = 0,
    slide   = 1,
    offsets = {},
    average = {},
    magic   = 0,
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

    var ping;
    var pingInterval = setInterval(function()
    {
        socket.emit('ping', {ping: new Date().getTime(), last: ping});
    }, 1000);

    socket.on('pong', function(time)
    {
        ping = (new Date().getTime() - time.ping) / 2;

        if(typeof offsets[socket.id] == "undefined")
        {
            offsets[socket.id] = [];
        }
        
        offsets[socket.id].unshift(time.pong - time.ping - ping);
        offsets[socket.id] = offsets[socket.id].slice(0, 100);

        var total = 0;
        for(var i = 0; i < offsets[socket.id].length; i++)
        {
            total += offsets[socket.id][i];
        }

        average[socket.id] = total / offsets[socket.id].length;
    });

    socket.on('incoming-magic', function() { magic = 1 });

    socket.on('debug', function()
    {
        socket.emit('debug', average);
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
            io.sockets.emit();

            var sockets = io.sockets.clients();
            for(var i = 0; i < sockets.length; i++)
            {
                if(magic && sensor.name == 'next')
                    sockets[i].emit('slide', {number: slide, type: sensor.name, time: new Date().getTime() + average[sockets[i].id] + 1000});
                else
                    sockets[i].emit('slide', {number: slide, type: sensor.name, time: new Date().getTime() + average[sockets[i].id] + 100});
            }

            magic = 0;
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
