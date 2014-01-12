

var express = require('express')
  , app     = require('express')()
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , count   = 0;

function getDate()
{
    var date = new Date();
    
    var   day   = date.getDate()
        , month = date.getMonth() + 1
        , year  = date.getFullYear()
        , hour  = date.getHours()
        , min   = date.getMinutes()
        , sec   = date.getSeconds();

    return day+'-'+month+'-'+year+' '+hour+':'+min+':'+sec;
}

server.listen(1337);

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res)
{
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket)
{
    count++;
    io.sockets.emit('count', {users: count});

    console.log(getDate() + ' User connected');

    socket.on('disconnect', function ()
    {
        console.log(getDate() + ' User disconnected');
        count--;
        
        io.sockets.emit('count', {users: count});
    });
});

var five = require("johnny-five"),
  board, sensor;

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

    board.repl.inject({
        sensor: sensor
    });

    var trigger = new Date();

    function handleSensor(sensor)
    {
        // Only send data over the socket ever 250ms
        if(sensor.value > 500 && new Date() - trigger > 250)
        {
            trigger = new Date();
            io.sockets.emit('sensor', sensor);
            console.log(sensor.name, sensor.value);
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
