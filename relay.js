const raspi = require("raspi");
const I2C = require("raspi-i2c").I2C;
const Gpio = require("onoff").Gpio;
const security = require("./security");
const I2CADDRESS = 0x10;
const PUMP = 0x01;
const ESIK = 0x02;
const KORIDOR = 0x03;
const ATTIC = 0x04;
// const security = new Gpio(4, "in", "both");

const i2c = new I2C();

security.watch();

/*****Raspberry k2ivitus*****/
raspi.init();

// var start = schedule.schedulejob({ hour: 7 }, () => {
//   turnOnAndOff20MinuteCycle;
// });
// var end = schedule.schedulejob({ hour: 22 }, () => {
//   clearTimeout(turnOnAndOff20MinuteCycle);
// });

// var turnOnAndOff20MinuteCycle = setInterval(pumpDailyCycle, 12000000);

// function pumpDailyCycle() {
//   pumpTurnOn();
//   var turnOff = setInterval(pumpTurnOff, 1020000);
// }

// function pumpTurnOn() {
//   i2c.writeByte(I2CADDRESS, PUMP, 0x10);
//   console.log("Pump should be on.");
// }

// function pumpTurnOff() {
//   i2c.writeByte(I2CADDRESS, PUMP, 0x00);
//   console.log("Pump should be off.");
// }

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

function turnOnLight(relay, onoff) {
  if (onoff == 1) {
    onoff = 0x10;
  } else {
    onoff = 0x00;
  }
  i2c.writeByte(I2CADDRESS, relay, onoff);
}

function readRelay(relay) {
  i2c.readByte(I2CADDRESS, relay)
}
// async function listenSecurity() {
//   security
//     .watch((err, value) => {
//       if (value === 1) return true;
//     })
//     .catch((err) => console.log(err.message));
// }

module.exports = { turnOnLight };
