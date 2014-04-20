
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('received: %s', message);
  });
  ws.send('something');
});

function reqeustConfirm(name) {
  // TODO
}

function lockInterface() {
  // TODO
}

function unlockInterface() {
  // TODO
}

function verifyTOTP(code) {
  // TODO
  // https://github.com/guyht/notp
}
