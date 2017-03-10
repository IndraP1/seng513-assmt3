// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    var users = [];
    var username;
    var usercolor;

    // var username = getCookie("username");
    if (username === undefined) {
        username = "user" + Math.random();
        setCookie("username", username); 
        usercolor = "blue";
        setCookie("usercolor", usercolor);

        socket.emit('add-user', username, usercolor);
    }

    if ($.inArray(username, users) === -1) {
        users.push(username); 
    }

    $('div.username-display').html('You are user: ' + getCookie("username"));

    socket.on('change_username_cookie', function(msg) {
        setCookie("username", msg);
        $('div.username-display').html('You are user: ' + msg);
    });

    socket.on('change_usercolor_cookie', function(msg) {
        setCookie("usercolor", msg);
    });

    socket.on('change_userlist', function(users) {
        console.log("change userlist");
        $('#user-display').append('<li>'+users);
        console.log(users);
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
            $('#messages').append('<li><b>' + current_time + 
                    '</b> <username class="userColor" style="color:'+usercolor+';">' +
                    username + '</username>: <b>'+ msg.message + '</b>');
        } else {
            $('#messages').append('<li><b>' + current_time + 
                    '</b> <username class="userColor" style="color:'+usercolor+';">' +
                    username + '</username>: '+ msg.message);
        }
    });

    //WIP
    socket.on('disconnect', function() {
        socket.emit('disconnected', username);
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
