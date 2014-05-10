
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
  var $lock = $('.lock');
  var wsLocation = "ws://localhost:3232";
  var wsTimerId = 0;

  (function wsInit(wsLocation) {
    window.ws = new WebSocket(wsLocation);

    function send(data) {
        data = JSON.stringify(data);
        window.ws.send(data);
    }

    ws.onopen = function () {
      if (wsTimerId) {
        clearInterval(wsTimerId);
        wsTimerId = 0;
      }

      console.log('Connected');
      $status.removeClass('status-error');
      $status.addClass('status-connected');
      $status.text('Соединение установлено');
      send({action: 'ping'});
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

    ws.onmessage = function (msg) {
        var data = JSON.parse(msg.data);
        
        if (data.action == 'ping') {
            console.log('received:', data);
        } else if (data.action == 'lock') {
            console.log('Lock action initiated');
            $lock.show();
        } else if (data.action == 'unlock') {
            $lock.hide();
            console.log('Unlock action initiated');
        }
    };
  }(wsLocation));
});


function requestConfirm(text) {
  // TODO
}

function verifyTOTP() {
  // TODO
}

