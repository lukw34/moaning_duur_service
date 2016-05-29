# Moaning "duur" service

Moaning "duur" service allow generating sound when door is start opening or closing. Service is dedicated to any version of Raspberry Pi. Originally this service is maintained on Raspberry Pi model B. 
### Version
1.0.0

## 1. Hardware
##### What do you need ?
- HC-SR04 ultrasonic sensor
- Raspberry Pi
- some cables
##### How to connect this elements ?
_Pins on Raspberry Pi B:_
![pins]
_HC-SR04 ultrasonic sensor:_
![sensor]

In HC-SR04 ultrasonic sensor you have 4 nonattachments:
* GND you must attach to one of the ground pins(GND) on example panel you can attach to pins with number: 6, 9, 14, 20, 25, 30, 34, 39,
* UCC is responsible for voltage and you must attach it to one of voltage pins from Raspberry Pi,
* TRIG is used to send signal, you shoulld connect it to one of GPIOX pins, where the X is number of GPIO. You must write this number in configuration files,
* ECHO is used to read signal, you shoulld connect it to one of GPIOX pins, where the X is number of GPIO. You must write this number in configuration files.

## 2. Software
#### Installation
You need npm and node installed globally:
```sh
$ git clone [git-repo-url]
$ cd moaning_duur_service
$ npm install
```
#### Configuration
You can configure every important parametes in configuration.json file.
```json
{
  "pins": {
    "trig": number of GPIO when trig is connected(default: 23),
    "echo": number of GPIO when echo is connected(default: 24)
  },
  "parameters": {
    "closeDoorDistance": 134,
    "startOpeningDistance": 42,
    "openDistanceHigh": 116,
    "openDistanceLow": 108,
    "delta": 10
  },
  "intervalTime": interval between measurement(default: 400),
  "musicDir": absolute path directory when are stored file
}
```
You should individualy configure parameters ! 
#### Run
It is very important to run as root.
```sh
$ sudo node index.js
```
## 3. Todo
- music from db

## 4.  Common problems
- The most common problem is connected with node version. This code are working perfectly with version 5.11 


[sensor]: https://www.element14.com/community/servlet/JiveServlet/showImage/38-22771-262582/HCSR04.jpg

[pins]: http://www.raspberrypi-spy.co.uk/wp-content/uploads/2012/06/Raspberry-Pi-GPIO-Layout-Model-B-Plus-rotated-2700x900.png






