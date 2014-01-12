var arduino = require('duino'),
    board = new arduino.Board({device: "ACM"});
/*
var led = new arduino.Led({
  board: board,
  pin: 13
});

led.blink();
*/
board = new arduino.Board({
 // debug: true
});

sensor = new arduino.Sensor({
  board: board,
  pin: 'A0'
});

sensor.on('read', function(err, value) {
  //value = +value;
  // |value| is the raw sensor output
  console.log( value);
});
