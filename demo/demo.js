
function verifyTOTP(code) {
  // TODO
}

function requestConfirm(name) {
  // TODO
}

function tryPassword(password) {
  // TODO
}

function send(data) {
    data = JSON.stringify(data);
    window.ws.send(data);
}

$(function () {
    var $status = $('.status');
    var $lock = $('.lock');
    var $verifyAction = $('.totp-verify-action');
    var $verifyResult = $('.totp-verify-result');
    var $confirmResult = $('.request-confirm-result');
    var wsLocation = "ws://localhost:3232";
    var wsTimerId = 0;

    $('.totp-verify-action').on('click', verifyTOTP);
    $('.totp-verify-input')
    .on('keypress', function (e) {
        if (e.which == 13) {
          verifyTOTP();
        }
    })
    .on('input', function () {
        $verifyResult.html('');
        $verifyResult.removeClass('verifySuccess verifyFailure');
    });

    $('.alert-button').on('click', function () {
        send({action: 'lock'});
    });

    $('.request-confirm-action').on('click', function () {
        $confirmResult.html('Запрос отправлен');
        $confirmResult.removeClass('verifySuccess verifyFailure');
        send({action: 'confirm', name: 'DEMO-AUTH'});
    });

    var verifyTOTP = function () {
        var code = $('.totp-verify-input').val();
        send({action: 'verifyTOTP', code: code});
    };

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

            } else if (data.action == 'verifyResult') {
                if (data.result) {
                    $verifyResult.html('Временный пароль введен верно');
                    $verifyResult.removeClass('verifySuccess verifyFailure');
                    $verifyResult.addClass('verifySuccess');
                } else {
                    $verifyResult.html('Временный пароль не верен');
                    $verifyResult.removeClass('verifySuccess verifyFailure');
                    $verifyResult.addClass('verifyFailure');
                }

            } else if (data.action == 'confirmResult') {
                if (data.result) {
                    $confirmResult.html('Ваш запрос подтвержден');
                    $confirmResult.removeClass('verifySuccess verifyFailure');
                    $confirmResult.addClass('verifySuccess');
                } else {
                    $confirmResult.html('Ваш запрос отклонен');
                    $confirmResult.removeClass('verifySuccess verifyFailure');
                    $confirmResult.addClass('verifyFailure');
                }
            }
        };
    }(wsLocation));
});

