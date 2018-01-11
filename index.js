"use strict"

var nipple = require('nipplejs');
var $ = require('jquery');
var BarChart = require('barchart');

function Controller() {
    this.url = "/";
    this.canResend = true;
};

Controller.prototype.createChart = function () {
    this.bc = new BarChart({
        barColors: ['#7B9F35', '#AAAA39'],
        labelInsideColors: ['#9775AA', '#CD88AF'],
        autoScale: true,
        isAnimated: false,
        minimum: 0,
        maximum: 1023,
        container: document.getElementById('chart-forward')
    });
    this.bcBack = new BarChart({
        barColors: ['#7B9F35', '#AAAA39'],
        labelInsideColors: ['#9775AA', '#CD88AF'],
        autoScale: true,
        isAnimated: false,
        minimum: 0,
        maximum: 1023,
        container: document.getElementById('chart-backward')
    });
}

Controller.prototype.init = function () {
    this.createChart();
    var joystickSize = 200;
    var manager = nipple.create({
        zone: document.getElementById('zone_joystick'),
        size: joystickSize
    });
    this.url = 'http://' + document.getElementById('url').value;
    manager.on('move', (evt, target) => {
        var radian = target.angle.radian;
        var max = 130;
        var axis = manager[0].position.x - target.position.x;
        axis = axis/(joystickSize/2);
        var power = manager[0].position.y - target.position.y;
        var left = 1023*(power*(1+axis)/max);
        var right = 1023*(power*(1-axis)/max);
        var chartVals = [
            (left > 0) ? left : 0,
            (right > 0) ? right : 0
        ];
        this.bc.data([
            [{"name": "left", "value" : chartVals[0]}],
            [{"name": "right", "value" : chartVals[1]}],
        ]);
        chartVals = [
            (left < 0) ? -left : 0,
            (right < 0) ? -right : 0
        ];
        this.bcBack.data([
            [{"name": "left", "value" : chartVals[0]}],
            [{"name": "right", "value" : chartVals[1]}],
        ]);
        if (this.canResend) {
            this.canResend = false;
            this.sendDirection(left, right);
        }
    });

    var onStop = () => {
        $.ajax({
            type: "POST",
            url: this.url,
            data: {stop: true},
        });
    }
    manager.on("end hidden destroyed", (evt, target) => { onStop() });

    var stop = document.getElementById('stop');
    stop.onclick = () => { onStop() };
}

Controller.prototype.sendDirection = function (left, right) {
    $.ajax({
        type: "POST",
        url: this.url,
        data: {left: left, right: right},
        success: () => {
            this.canResend = true;
        }
    });
}

window.onload = () => {
    var controller = new Controller();
    controller.init();
};
