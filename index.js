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
    next();
});

// listen to 'chat' messages
io.on('connection', function(socket){
    console.log("user connected");

    socket.on('chat', function(msg){
        var current_date = new Date(); 
        var firstWord = msg.message.split(' ')[0];

        if (firstWord === "/nick") {
            console.log(users);
            var secondWord = msg.message.split(' ')[1];
            var index = users.indexOf(secondWord)
            if (index === -1) {
                users[users.indexOf(msg.name)] = secondWord;
                socket.emit('change_username_cookie', secondWord);
            }
            console.log(users);
        }
        if (firstWord === "/nickcolor") {
            var secondWord = msg.message.split(' ')[1];
            console.log(secondWord);
            socket.emit('change_usercolor_cookie', secondWord);
        }
        // send to self
        socket.emit('chat', {message: msg.message, date: current_date, name: msg.name, color: msg.color, style: "bold"});
        // send to all clients except sender
        socket.broadcast.emit('chat', {message: msg.message, date: current_date, name: msg.name, color: msg.color});
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

app.use(express.static(__dirname + '/public'));
