'use strict';

var tls = require('tls');
var StateEmitter = require('state-emitter').StateEmitter;

module.exports = function (params) {
    var
        ondata,
        host = params.host,
        port = params.port,
        state = new StateEmitter(undefined);

    return {
        connect: function () {
            var
                socket = tls.connect(port, host, function () {
                    state.next(true);
                });

            socket.on('data', ondata);
            socket.on('end', function () {
                state.next(false);
            });
            socket.on('error', function () {
                state.next(false);
            });
            this.send = function (data) {
                socket.write(data);
            };
        },
        onOpen: function (callback) {
            state.whenEqual(true, callback);
        },
        onEnd: function (callback) {
            state.whenEqual(false, callback);
        },
        onError: function (callback) {
            state.whenEqual(false, callback);
        },
        onData: function (callback) {
            ondata = callback;
        }
    };
};
