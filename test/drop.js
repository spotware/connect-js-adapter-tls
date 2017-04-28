const
    test = require('ava'),
    ProtoMessages = require('connect-protobuf-messages'),
    EncodeDecode = require('connect-js-encode-decode'),
    protocol = new ProtoMessages([
        {
            file: 'node_modules/connect-protobuf-messages/src/main/protobuf/CommonMessages.proto',
            protoPayloadType: 'ProtoPayloadType'
        }
    ]),
    encodeDecode = new EncodeDecode(),
    codec = require('connect-js-codec').codec(encodeDecode, protocol),
    port = 5032,
    host = 'sandbox-tradeapi.spotware.com',
    createAdapter = require('../index'),
    adapter = createAdapter(codec);

test.cb('inacitve socket should be closed', t => {
    protocol.load();
    protocol.build();

    adapter.onData(() => {});
    adapter.onEnd(() => {
        t.end();
    });
    adapter.connect(port, host);
});
