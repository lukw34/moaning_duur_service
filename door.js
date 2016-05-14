var machina = require('machina');
var soundPlayer = require('./soundPlayer.js');

const CLOSE_DISTANCE = 134;
const START_OPENING_DISTANCE = 42;
const OPEN_DISTANCE_HIGH = 116;
const OPEN_DISTANCE_LOW = 108;


exports.doorMachina = machina.Fsm.extend({
    initialState: 'close',
    states: {
        'close': {},
        'opening': {},
        'open': {},
        'closing': {}
    }
});

exports.stateChange = (last, actual, door) => {
    var delta = actual - last;

    var defaultPromise = new Promise((resolve, reject) => resolve());

    if (actual > CLOSE_DISTANCE) {
        door.transition('close');
        return defaultPromise;
    }

    switch (door.state) {
        case 'close':
            if (actual < START_OPENING_DISTANCE) {
                door.transition('opening');
                return soundPlayer.play('./music/cartoon.wav');
            }

            return defaultPromise;
        case 'open':
            if (actual < OPEN_DISTANCE_LOW) {
                door.transition('closing');
                return soundPlayer.play('./music/cartoon.wav');
            }

            return defaultPromise;
        case 'opening':
            if (actual > OPEN_DISTANCE_HIGH) {
                door.transition('open');
            } else if (delta < -10) {
                door.transition('closing');
                return soundPlayer.play('./music/cartoon.wav');
            }

            return defaultPromise;
        case 'closing':
            if (actual > CLOSE_DISTANCE) {
                door.transition('close');
            } else if (delta > 10) {
                door.transition('opening');
                return soundPlayer.play('./music/cartoon.wav');
            }

            return defaultPromise;
    }

    console.log('end of transition');

};


