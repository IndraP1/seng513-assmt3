var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var cookie = require('cookies');
var cookieParser = require('cookie-parser');

app.use(cookieParser());

http.listen( port, function () {
    console.log('listening on port', port);
});

app.get('/', function(req, res, next) {
    username = "user" + Math.random();

    if (req.cookies.user === undefined) {
        res.cookie("username", username);
    }

    usercolor = "blue";
    if (req.cookies.usercolor === undefined) {
        res.cookie("usercolor", usercolor);
    }

    console.log(req.cookies);
    next();
});

// listen to 'chat' messages
io.on('connection', function(socket){
    console.log("user connected");

    socket.on('chat', function(msg){
        io.emit('chat', msg);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

app.use(express.static(__dirname + '/public'));
