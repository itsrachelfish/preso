var express = require('express'),
    app     = require('express')(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    users   = 0,
    slide   = 1,
    offsets = {},
    average = {},
    magic   = 0;

server.listen(1337);


// Create routes for static content and the index
app.use(express.static(__dirname + '/static'));
app.get('/', function (req, res)
{
  res.sendfile(__dirname + '/index.html');
});

app.get('/admin', function (req, res)
{
  res.sendfile(__dirname + '/admin.html');
});

app.get('/time', function(req, res)
{
  res.sendfile(__dirname + '/time.html');
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

    socket.on('slide', function(hax)
    {
        slide = hax.slide;
        io.sockets.emit('slide', {number: slide, name: "hax"});
    });

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
    socket.on('abort', function() { io.sockets.emit('abort') });

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

