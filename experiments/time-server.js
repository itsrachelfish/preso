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
    socket.emit('time', {serverTime: new Date().getTime()});

    var ping;
    var pingInterval = setInterval(function()
    {
        socket.emit('ping', {ping: new Date().getTime(), last: ping});
    }, 1000);

    socket.on('pong', function(time)
    {
        ping = (new Date().getTime() - time.ping) / 2;
    });
    
    socket.on('disconnect', function ()
    {
        users--;
        clearInterval(pingInterval);
        io.sockets.emit('users', {users: users});
    });
});


setInterval(function()
{
    var date = new Date();    
    var text = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];
    
    console.log(text.join(" "));
}, 1);
