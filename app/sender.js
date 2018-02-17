"use strict"

var $ = require('jquery');

function Sender() {
    this.url = "/";
    this.canResend = true;

    this.onMove = (data) => {
        if (this.canResend) {
            this.canResend = false;
            $.ajax({
                type: "POST",
                url: this.url,
                data: data,
                success: () => {
                    this.canResend = true;
                }
            });
        }
    }

    this.onStop = (data) => {
        $.ajax({
            type: "POST",
            url: this.url,
            data: {stop: 1}
        });
    }
};
module.exports = Sender;