"use strict"

const TouchEmulator = require('hammer-touchemulator');
TouchEmulator();
const Sender = require('./app/sender');
const Events = require('./app/events');
const TankController = require('./app/tank-controller');

window.onload = () => {
    var events = new Events();
    var sender = new Sender();
    events.addListener(sender.onMove, "move");
    events.addListener(sender.onStop, "stop");
    var controller = new TankController(events);
    controller.init();
};
