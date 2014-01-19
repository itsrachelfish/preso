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
                    sockets[i].emit('slide', {number: slide, type: sensor.name, time: new Date().getTime() + average[sockets[i].id] + 10000});
                else
                    sockets[i].emit('slide', {number: slide, type: sensor.name, time: new Date().getTime() + average[sockets[i].id] + 100});
            }

            magic = 0;
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
