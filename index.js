'use strict';

var
    tls = require('tls'),
    StateEmitter = require('state-emitter').StateEmitter;

module.exports = function (codec) {
    var
        ondata,
        socket,
        connected = true,
        disconnected = false,
        state = new StateEmitter();

    return {
        connect: function (port, host) {
            socket = tls.connect(port, host, function () {
                state.next(connected);
            });
            socket.on('data', codec.decode);
            socket.on('end', function () {
                state.next(disconnected);
            });
            socket.on('error', function () {
                state.next(disconnected);
            });
        },
        send: function (message) {
            socket.write(
                codec.encode(message.payloadType, message.payload, message.clientMsgId)
            );
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
            codec.subscribe(callback);
        }
    };
};
