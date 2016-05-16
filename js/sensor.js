var devDoor = require('./door.js');
var devDoorMachina = new devDoor.doorMachina;
var usonic = require('r-pi-usonic');
var promise = require('bluebird');
var conf = require("../configuration.json");

const INTERVAL_TIME = conf.intervalTime;
const ECHO = conf.pins.echo;
const TRIG = conf.pins.trig;

var promiseWhile = function(condition, action) {
    var resolver = promise.defer();

    var loop = function() {
        if (!condition()) return resolver.resolve();
        return promise.cast(action())
            .then(loop)
            .catch(resolver.reject);
    };
    process.nextTick(loop);

    return resolver.promise;
};

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
        var sensor = usonic.createSensor(ECHO, TRIG, 1000);
        console.log('Działa ' + devDoorMachina.state);
        var distance = sensor().toFixed(2);
        var lastMeasurement = 134;
        
        promiseWhile(() => true, () => {
            return new Promise((resolve, reject) => {
                distance = sensor().toFixed(2);
                if(distance === -1 || distance > 400) {
                    console.log('olewam');
                    resolve();
                } else {
                    devDoor.stateChange(lastMeasurement, distance, devDoorMachina).then(() => {
                        console.log('Distance: ' + distance + '  ' + devDoorMachina.state);
                        lastMeasurement = distance;
                        return waitFor(INTERVAL_TIME);
                    }).then(() => resolve()).catch(err => {
                        console.log(err);
                        resolve();
                    });
                }                
            });
        }).catch(err => {
            console.log(err);
        })
    }
});










