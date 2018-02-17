"use strict"

class Events
{
    constructor() {
        this.listeners = [];
    }

    fire(eventName, data) {
        if (this.listeners[eventName] !== undefined) {
            for (let listener of this.listeners[eventName]) {
                listener(data);
            }
        }
    }

    addListener(listener, eventName) {
        if (this.listeners[eventName] === undefined) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(listener);
    }
};

module.exports = Events;
