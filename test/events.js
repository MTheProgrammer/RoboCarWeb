const assert = require('assert');
const Events = require('../app/events');

describe('events', function() {
    describe('#addListener()', function() {
        let listener = function () {};
        listener.prototype.onMove = function () {};
        var events = new Events();
        events.addListener(listener, 'testListener');
        it('should be called', function() {
            assert.equal(1, 2);
        });
    });
});