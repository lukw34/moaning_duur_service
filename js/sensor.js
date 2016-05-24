var devDoor = require('./door.js');
var devDoorMachina = new devDoor.doorMachina();
var async = require('async');
var usonic = require('r-pi-usonic');
var conf = require("../configuration.json");

const INTERVAL_TIME = conf.intervalTime;
const ECHO = conf.pins.echo;
const TRIG = conf.pins.trig;

function waitFor(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

usonic.init(err => {
    if (err) {
        throw err;
    } else {
        console.log('Dziala ' + devDoorMachina.state);
        var sensor = usonic.createSensor(ECHO, TRIG, 1000);
        var distance = sensor().toFixed(2);
        var lastMeasurement = 134;
        async.forever(next => {
            distance = sensor().toFixed(2);
            if (distance === -1 || distance > 500) {
                console.log('olewam');
                next(null);
            } else {
                devDoor.stateChange(lastMeasurement, distance, devDoorMachina).then(() => {
                    console.log('Distance: ' + distance + '  ' + devDoorMachina.state);
                    lastMeasurement = distance;
                    return waitFor(INTERVAL_TIME);
                }).then(() => next(null)).catch(err => {
                    console.log(err.message);
                    next(null);
                });
            }
        }, err => {
            console.log(err.message);
        });
    }
});










