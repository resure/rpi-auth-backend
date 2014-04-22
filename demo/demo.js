
function verifyTOTP(code) {
  // TODO
}

function requestConfirm(name) {
  // TODO
}

function tryPassword(password) {
  // TODO
}

$(function () {
  var $status = $('.status');
  var wsLocation = "ws://localhost:8080";
  var wsTimerId = 0;

  (function wsInit(wsLocation) {
    window.ws = new WebSocket(wsLocation);

    ws.onopen = function () {
      if (wsTimerId) {
        clearInterval(wsTimerId);
        wsTimerId = 0;
      }

      console.log('Connected');
      $status.removeClass('status-error');
      $status.addClass('status-connected');
      $status.text('Соединение установлено');
      ws.send('pong');
    };

    ws.onclose = function (error) {
      $status.removeClass('status-connected');
      $status.addClass('status-error');
      $status.text('Соединение прервано');

      if (!wsTimerId) {
        wsTimerId = setInterval(function () {
          console.log('Trying to reconnect...');
          wsInit(wsLocation);
        }, 5000);
      }
    };

    ws.onmessage = function (e) {
      // TODO
    };
  }(wsLocation));
});


function requestConfirm(text) {
  // TODO
}

function verifyTOTP() {
  // TODO
}

