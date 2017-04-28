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

test.cb('send ping message then recive respond', t => {
    const
        pingReq = 52,
        pingRes = 53,
        payload = {timestamp: Date.now()},
        clientMsgId = 'uuid';

    protocol.load();
    protocol.build();

    adapter.onOpen(() => {
        adapter.send({
            payloadType: pingReq,
            payload: payload,
            clientMsgId: clientMsgId
        });
    });
    adapter.onData((payloadType, respond, id) => {
        t.is(payloadType, pingRes);
        t.not(respond.timestamp, undefined);
        t.is(id, clientMsgId);
        t.end();
    });
    adapter.connect(port, host);
});
