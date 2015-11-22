// Usage: run this with your admin password as an argument:
// user@host:~/preso$ node preso.js "lol hacked"

var express = require('express'),
    app     = require('express')(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    auth    = {},
    users   = 0,
    magic   = 0
    slide   = 1;


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


// Function to control slides
// Used by the remote admin interface and arduino
var handleAction = function(action)
{
    if(action.name == 'previous') {
        if(slide > 0) slide--;
    }
    else if(action.name == 'next') {
        slide++;
    }

    if(magic && action.name == 'next')
        io.sockets.emit('slide', {number: slide, time: new Date().getTime() + 1000 });
    else
        io.sockets.emit('slide', {number: slide, time: new Date().getTime() + 100 });

    magic = 0;
}

// Websocket magic
io.sockets.on('connection', function (socket)
{
    users++;

    // Notify other clients of the new user
    io.sockets.emit('users', {count: users});

    // Let the new user know they're connected
    socket.emit('status', {message: "Connected"});
    socket.emit('slide', {number: slide, name: "new"});
    socket.emit('time', {serverTime: new Date().getTime()});

    // Show navigation buttons to users if no admin password was used
    if(process.argv[2] === undefined)
    {
        socket.emit('show', {selector: '.buttons'});
    }

    socket.on('action', function(action)
    {
        // Only accept actions from authed users
        if(typeof auth[socket.id] != "undefined" && auth[socket.id] || process.argv[2] === undefined)
            handleAction(action);
    });

    socket.on('abort', function()
    {
        if(typeof auth[socket.id] != "undefined" && auth[socket.id] || process.argv[2] === undefined)
            io.sockets.emit('abort');
    });

    var ping;
    var pingInterval = setInterval(function()
    {
        socket.emit('ping', {ping: new Date().getTime(), last: ping});
    }, 1000);

    socket.on('pong', function(time)
    {
        ping = (new Date().getTime() - time.ping) / 2;
    });

    socket.on('incoming-magic', function() { magic = 1 });

    socket.on('debug', function()
    {
        socket.emit('debug', average);
    });

    socket.on('password', function(password)
    {
        if(password.value == process.argv[2])
        {
            auth[socket.id] = true;
            socket.emit('authenticated');
            socket.emit('status', {message: 'Authenticated'});
            socket.emit('users', {count: users});
        }
    });

    socket.on('disconnect', function ()
    {
        clearInterval(pingInterval);
        users--;
        
        io.sockets.emit('users', {count: users});
    });
});

var net = require('net');
var server = net.createServer();
server.listen(9001, '0.0.0.0');

server.on('connection', function(sock)
{   
    sock.on('data', function(data)
    {
        if(data == "previous")
            handleAction({name: 'previous'});
        else if(data == "next")
            handleAction({name: 'next'});        
    });
});

