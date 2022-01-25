const schedule = require('node-schedule');
const raspi = require('raspi');
const I2C = require('raspi-i2c').I2C;
const Gpio = require('onoff').Gpio;
const security = require("./security");
const I2CADDRESS = 0x10;
const PUMP = 0x01;
const ESIK = 0x02;
const KORIDOR = 0X03;
const ATTIC = 0X04;
const security = new Gpio(4, 'in', 'both');

const rule = new schedule.RecurrenceRule();
rule.hour = [0, new schedule.Range(6, 22)];

const i2c = new I2C();

security.watch()

/*****Raspberry k2ivitus*****/

raspi.init(() => {

    //Pumba taimer
    schedule.scheduleJob(rule, async () => {
        while (listenSecurity) {
            i2c.writeByte(I2CADDRESS, PUMP, 0x10);
            console.log("Pump should be on.")
            // await sleep(180000);
            await sleep(2000);
            i2c.writeByte(I2CADDRESS, PUMP, 0x00);
            console.log("Pump should be off.")
            // await sleep(1020000);
            await sleep(2000);
        }
    })
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function turnOnLight(relay, onoff) {
    if (onoff == 1) {
        onoff = 0x10;
    } else {
        onoff = 0x00
    }
    i2c.writeByte(I2CADDRESS, relay, onoff)
}

async function listenSecurity() {
    security.watch((err, value) => {
        
        if (value === 1) return true;
        
    }).catch((err) => console.log(err.message))
}

module.exports = { turnOnLight, listenSecurity };