
var config  = require('./config'),
    totp    = require('notp').totp,
    status = 'idle';

config.redisPrefix = config.redisPrefix || 'rpi-auth-backend-';
config.wsPort = config.wsPort || 8080;


// Redis ----------------------------------------------------------------------

// var Redis = require("redis"),
//     redis = Redis.createClient();

// redis.on("error", function (err) {
//   console.error("Redis:", err);
// });

// setTimeout(function () {
//     setStatus('idle');
// }, 75);


// WebSocket server -----------------------------------------------------------

var WebSocketServer = require('ws').Server,
    wss             = new WebSocketServer({ port: config.wsPort });

wss.on('connection', function (ws) {

    if (status === 'locked') {
        send(ws, {action: 'lock'});
    }

    ws.on('message', function (message) {
        try {
            message = JSON.parse(message);
            console.log('received:', message);
        } catch(e) {
            console.log('parse error:', e);
            return;
        }

        if (status == 'locked' && message.action != 'unlock') {
            broadcast(wss, {action: 'unauthorized'});
            return;
        }

        if (message.action == 'ping') {
            send(ws, {action: 'pong'});

        } else if (message.action == 'lock') {
            ensureAuth(message.__token, function () {
                broadcast(wss, {action: 'lock'});
                status = 'locked';
            });

        } else if (message.action == 'unlock') {
            ensureAuth(message.__token, function () {
                broadcast(wss, {action: 'unlock'});
                status = 'idle';
            });

        } else if (message.action == 'verifyTOTP') {
            var result = verifyTOTP(message.code);
            send(ws, {action: 'verifyResult', result: result});

        } else if (message.action == 'confirm') {
            broadcast(wss, {action: 'confirm', name: message.name});

        } else if (message.action == 'confirmResult') {
            broadcast(wss, {
                action: 'confirmResult',
                name: message.name,
                result: message.result
            });
            // Here we need to save message.name and result
            // to allow request originator to do something
        }

        // TODO: replace broadcast with RPi client object
    });
});


// Helpers --------------------------------------------------------------------

function ensureAuth(token, fun) {
    if (token === config.key) {
        fun();
    } else {
        broadcast(wss, {action: 'unauthorized'});
    }
}

function send(ws, data) {
    data = JSON.stringify(data);
    ws.send(data);
}

function broadcast(wss, data) {
    data = JSON.stringify(data);

    wss.clients.forEach(function (client) {
        client.send(data);
    });
}

function requestConfirm(name) {
  // TODO
}

function lockInterface() {
  // TODO
}

function unlockInterface() {
  // TODO
}

function verifyTOTP(code) {
  return code == totp.gen(config.key, { time: 30 });
}

// function redisKey(key) {
//   return config.redisPrefix + key;
// }

