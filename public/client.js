// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    var usercolor;
    var username = getCookie("username");

    if (username === undefined || username === "" || username === null) {
        username = "user" + Math.random();
        setCookie("username", username); 
        usercolor = "blue";
        setCookie("usercolor", usercolor);

        socket.emit('add-user', username, usercolor);
    } else {
        username = getCookie("username");
        usercolor = getCookie("usercolor");

        socket.emit('add-user', username, usercolor);
    }

    $('div.username-display').html('You are user: ' + getCookie("username"));

    socket.on('change_username_cookie', function(msg) {
        setCookie("username", msg);
        $('div.username-display').html('You are user: ' + msg);
    });

    socket.on('change_usercolor_cookie', function(msg) {
        setCookie("usercolor", msg);
    });

    socket.on('load-history', function(messages) {
        console.log(messages);
        for (var i in messages) {
            $('#messages').append(messages[i]);
        }
    });

    socket.on('change_userlist', function(users) {
        $('#user-display').empty();
        for (var i in users) {
            $('#user-display').append('<li>'+users[i]);
        }
    });

    $('form').submit(function() {
        socket.emit('chat', {message: $('#m').val(), name: getCookie("username"), color: getCookie("usercolor")});
        $('#m').val('');
        return false;
    });

    socket.on('chat', function(msg) {
        current_date = new Date(msg.date)

        username = msg.name;
        var current_time = current_date.getHours() + ":"
            + current_date.getMinutes() + " ";
        var usercolor = msg.color;

        if (msg.style === "bold") {
            message = '<li><b>' + current_time + 
                    '</b> <username class="userColor" style="color:'+usercolor+';">' +
                    username + '</username>: <b>'+ msg.message + '</b>';
            $('#messages').append(message);
        } else {
            message = '<li><b>' + current_time + 
                    '</b> <username class="userColor" style="color:'+usercolor+';">' +
                    username + '</username>: '+ msg.message;
            $('#messages').append(message);
        }
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
