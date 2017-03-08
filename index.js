'use strict';

var tls = require('tls');
var StateEmitter = require('state-emitter').StateEmitter;

var AdapterTLS = function (params) {
    this.host = params.host;
    this.port = params.port;
    this.state = new StateEmitter(undefined);
};

AdapterTLS.prototype.connect = function () {
    var
        state = this.state,
        socket = tls.connect(this.port, this.host, function () {
            state.next(true);
        });

    socket.on('data', this.ondata);
    socket.on('end', function () {
        state.next(false);
    });
    socket.on('error', function () {
        state.next(false);
    });
    this.send = function (data) {
        socket.write(data);
    };
};

AdapterTLS.prototype.onOpen = function (callback) {
    this.state.whenEqual(true, callback);
};

AdapterTLS.prototype.onEnd = function (callback) {
    this.state.whenEqual(false, callback);
};

AdapterTLS.prototype.onError = function (callback) {
    this.state.whenEqual(false, callback);
};

AdapterTLS.prototype.onData = function (ondata) {
    this.ondata = ondata;
};

module.exports = AdapterTLS;
