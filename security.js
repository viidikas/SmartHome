const Gpio = require('onoff').Gpio;

const security = new Gpio(4, 'in', 'both');

//Kontrolli, kas valve on peal või ei

function armed () {
    security.watch(err, value)  
        if (err) {
            return err
        }
        else {
            return value
        }
    }

module.exports = { add };


