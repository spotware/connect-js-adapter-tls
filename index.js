'use strict';

var
    tls = require('tls'),
    StateEmitter = require('state-emitter').StateEmitter;

module.exports = function (params) {
    var
        ondata,
        socket,
        connected = true,
        disconnected = false,
        host = params.host,
        port = params.port,
        state = new StateEmitter();

    return {
        connect: function () {
            socket = tls.connect(port, host, function () {
                state.next(connected);
            });
            socket.on('data', ondata);
            socket.on('end', function () {
                state.next(disconnected);
            });
            socket.on('error', function () {
                state.next(disconnected);
            });
        },
        send: function (data) {
            socket.write(data);
        },
        onOpen: function (callback) {
            state.whenEqual(connected, callback);
        },
        onEnd: function (callback) {
            state.whenEqual(disconnected, callback);
        },
        onError: function (callback) {
            state.whenEqual(disconnected, callback);
        },
        onData: function (callback) {
            ondata = callback;
        }
    };
};
