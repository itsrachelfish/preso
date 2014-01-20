// Usage: run this with the server you're connecting to as an argument:
// user@host:~/preso$ node arduino.js 192.168.1.100

var net = require('net');
var client = new net.Socket();
client.connect(9001, process.argv[2]);

var five = require("johnny-five"), board, sensor;
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
        // Only send data over the socket every 250ms
        if(sensor.value > 500 && new Date() - trigger > 250)
        {
            trigger = new Date();
            client.write(sensor.name);
            console.log("sending "+sensor.name);
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
