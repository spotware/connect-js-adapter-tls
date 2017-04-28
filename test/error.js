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
    host = null,
    createAdapter = require('../index'),
    adapter = createAdapter(codec);

test.cb('handle connect error', t => {
    protocol.load();
    protocol.build();

    adapter.onData(() => {});
    adapter.onError(() => {
        t.end();
    });
    adapter.connect(port, host);
});
