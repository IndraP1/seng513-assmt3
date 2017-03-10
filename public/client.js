// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    var users = [];
    var username;
    // $("username-display").update("You are user: " + getCookie("username"));

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
        $('div.username-display').html('You are user: ' + msg);

        // fieldNameElement.innerHTML = "My new text!";

        // $('username-display').text("You are user: " + msg);
        // var text = document.getElementById("username-display").textContent;
        // document.getElementById("username-display").textContent = "This is some text";
    });

    socket.on('change_usercolor_cookie', function(msg) {
        setCookie("usercolor", msg);
    });

    socket.on('change_userlist', function(users) {
        console.log("here");
        console.log(users);
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
