"use strict"

function TankController(events, options) {
    this.events = events;
    this.multiplier = 1023;
    this.maxTilt = 200;
    this.touches = null;

    this.startHandler = (ev) => {
        ev.preventDefault();
        if (ev.targetTouches.length == 2) {
            this.touches = [];
            for (let i = 0; i < ev.targetTouches.length; i++) {
                let touch = ev.targetTouches[i];
                this.touches[touch.identifier] = touch;
            }
        }
    }

    this.moveHandler = (ev) => {
        ev.preventDefault();
        if (ev.targetTouches.length == 2) {
            let distance = [];
            let touchesMoved = [];
            for (let i = 0; i < ev.targetTouches.length; i++) {
                let touch = ev.targetTouches[i];
                let tilt = this.touches[touch.identifier].clientY - touch.clientY;
                distance.push({
                    x: touch.clientX,
                    power: this.calculatePower(tilt)
                });
            }
            distance.sort((a, b) => {
                return a.x - b.x;
            });
            let evtData = {
                right: distance[0].power,
                left: distance[1].power
            };
            console.log(evtData);
            this.events.fire("move", evtData);
        }
    }

    this.endHandler = (ev) => {
        ev.preventDefault();
        this.events.fire("stop");
    }
};

TankController.prototype.init = function () {
    document.addEventListener("touchstart", this.startHandler, false);
    document.addEventListener("touchmove", this.moveHandler, false);
    document.addEventListener("touchcancel", this.endHandler, false);
    document.addEventListener("touchend", this.endHandler, false);
    window.addEventListener("resize", (ev) => {
        this.recalculateMaxTilt();
    }, true);
    window.addEventListener("load", (ev) => {
        this.recalculateMaxTilt();
    }, true);
}

TankController.prototype.calculatePower = function (value) {
    if (value > this.maxTilt) {
        value = this.maxTilt;
    } else if (value < -this.maxTilt) {
        value = -this.maxTilt;
    }
    return this.multiplier*(value/this.maxTilt);
}

TankController.prototype.recalculateMaxTilt = function ()
{
    this.maxTilt = (window.innerHeight/3);    
}

module.exports = TankController;
