var machina = require('machina');
var soundPlayer = require('./soundPlayer.js');
var conf = require("../configuration.json");

const CLOSE_DISTANCE = conf.parameters.closeDoorDistance;
const START_OPENING_DISTANCE = conf.parameters.startOpeningDistance;
const OPEN_DISTANCE_HIGH = conf.parameters.openDistanceHigh;
const OPEN_DISTANCE_LOW = conf.parameters.openDistanceLow;
const DELTA = conf.parameters.delta;
const DIRECTORY = conf.musicDir;

getMusic = () => {
    var musics = fs.readdirSync(DIRECTORY);
    return DIRECTORY + musics[Math.floor(Math.random() * musics.length)];
};

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
                return soundPlayer.play(getMusic());
            }

            return defaultPromise;
        case 'open':
            if (actual < OPEN_DISTANCE_LOW) {
                door.transition('closing');
                return soundPlayer.play(getMusic());
            }

            return defaultPromise;
        case 'opening':
            if (actual > OPEN_DISTANCE_HIGH) {
                door.transition('open');
            } else if (delta < -DELTA) {
                door.transition('closing');
                return soundPlayer.play(getMusic());
            }

            return defaultPromise;
        case 'closing':
            if (actual > CLOSE_DISTANCE) {
                door.transition('close');
            } else if (delta > DELTA) {
                door.transition('opening');
                return soundPlayer.play(getMusic());
            }

            return defaultPromise;
    }
};


