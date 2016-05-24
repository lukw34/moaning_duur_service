var sound = require('node-aplay');
var fs = require('fs');

//create log file
fs.writeFile('./moaning.door.logs.txt', 'Moaning dur logs\n', err => {
    if (err) console.log(err);
});

exports.play = path => {

    var time = new Date();
    return new Promise((resolve, reject) => {
        var log = '[' + time + ']: ';

        //Unless music exist, promise will send reject and add new line in log file
        if (!fs.existsSync(path)) {
            log += 'ERROR -> ' + path + 'do not exist!\n';
            fs.appendFile('./moaning.door.logs.txt', log, err => {
                if (err) console.log(err);
            });

            reject(new Error(log));

        } else {

            var music = new sound(path);
            music.play();
            music.on('complete', () => {
                log += path + ' was played.\n';
                fs.appendFile('./moaning.door.logs.txt', log, err => {
                    if (err) console.log(err);
                });
                console.log('music played');
                resolve();
            });
        }
    });
};
