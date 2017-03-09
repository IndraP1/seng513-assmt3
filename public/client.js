// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    var users = [];

    $('form').submit(function() {
        socket.emit('chat', {message: $('#m').val(), name: getCookie("username"), color: getCookie("usercolor")});
        $('#m').val('');
        return false;
    });

    var username = getCookie("username");
    if ($.inArray(username, users) === -1) {
        users.push(username); 
    }

    socket.on('change_username_cookie', function(msg) {
        setCookie("username", msg);
    });

    socket.on('change_usercolor_cookie', function(msg) {
        setCookie("usercolor", msg);
    });

    socket.on('chat', function(msg) {
        current_date = new Date(msg.date)

        // if /nick tag or /color tag perform other operations else:
        // else if (firstWord === "/nickcolor") {
        //     var secondWord = msg.message.split(' ')[1];
        //     setCookie("usercolor", secondWord);
        // }

        var username = msg.name;
        var current_time = current_date.getHours() + ":"
            + current_date.getMinutes() + " ";
        var usercolor = msg.color;

        $('#messages').append('<li><b>' + current_time + 
                '</b> <username class="userColor" style="color:'+usercolor+';">' +
                username + '</username>: '+ msg.message);
    });
});

function getFirstWord(str) {
    if (str.indexOf(' ') === -1)
        return -1;
    else
        return str.substr(0, str.indexOf(' '));
};

// Code taken from https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
            if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
        }
    return "";
}
