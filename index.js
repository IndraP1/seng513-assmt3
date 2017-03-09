var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var cookie = require('cookies');
var cookieParser = require('cookie-parser');

var users = [];
app.use(cookieParser());

http.listen( port, function () {
    console.log('listening on port', port);
});

app.get('/', function(req, res, next) {
    if (req.cookies.user === undefined) {
        username = "user" + Math.random();
        res.cookie("username", username);
        users.push(username); 
    }

    if (req.cookies.usercolor === undefined) {
        usercolor = "blue";
        res.cookie("usercolor", usercolor);
    }
    console.log(users);
    next();
});

// listen to 'chat' messages
io.on('connection', function(socket){
    console.log("user connected");

    socket.on('chat', function(msg){
        var current_date = new Date(); 
        var firstWord = msg.message.split(' ')[0];

        if (firstWord === "/nick") {
            var secondWord = msg.message.split(' ')[1];
            if (users.indexOf(msg.secondWord) > -1) {
                console.log("username exists")
            } else {
                var index = users.indexOf(msg.name);
                users.splice(index, 1);
                users.push(secondWord); 
                socket.emit('change_username_cookie', secondWord);
            }
            console.log(users);
        }
        if (firstWord === "/nickcolor") {
            var secondWord = msg.message.split(' ')[1];
            console.log(secondWord);
            socket.emit('change_usercolor_cookie', secondWord);
        }
        console.log("msg" + msg.color);
        io.emit('chat', {message: msg.message, date: current_date, name: msg.name, color: msg.color});
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

app.use(express.static(__dirname + '/public'));
