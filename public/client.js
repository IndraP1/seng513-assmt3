// shorthand for $(document).ready(...)
$(function() {
    var socket = io();

    $('form').submit(function(){
        socket.emit('chat', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat', function(msg){
        var current_date = new Date(); 

        // if /nick tag or /color tag perform other operations else:
        var current_time = current_date.getHours() + ":"
            + current_date.getMinutes() + " ";
        var username = getCookie("username");
        var usercolor = getCookie("usercolor");

        $('#messages').append('<li><b>' + current_time + 
                '</b> <username class="userColor" style="color:'+usercolor+';">' +
                username + '</username>: '+ msg);
    });
});

// Code taken from https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
