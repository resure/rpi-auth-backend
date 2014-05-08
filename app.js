
var config  = require('./config'),
    totp    = require('notp').totp;

config.redisPrefix = config.redisPrefix || 'rpi-auth-backend-';
config.wsPort = config.wsPort || 8080;


// Redis ----------------------------------------------------------------------

var Redis = require("redis"),
    redis = Redis.createClient();

redis.on("error", function (err) {
  console.error("Redis:", err);
});

redis.set(redisKey('status'), 'idle');


// WebSocket server -----------------------------------------------------------

var WebSocketServer = require('ws').Server,
    wss             = new WebSocketServer({ port: config.wsPort });

wss.on('connection', function (ws) {

  ws.on('message', function (message) {
    console.log('received: %s', message);
  });

  ws.send('ping');
});


// Helpers --------------------------------------------------------------------

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
  return totp.verify(config.token, code, { time: 30 });
}

function redisKey(key) {
  return config.redisPrefix + key;
}

