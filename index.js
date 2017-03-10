var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var cookie = require('cookies');
var cookieParser = require('cookie-parser');

var users = new Map();
var userlist = [];

app.use(cookieParser());

http.listen( port, function () {
    console.log('listening on port', port);
});

// listen to 'chat' messages
io.on('connection', function(socket){

    socket.on('add-user', function(username, usercolor){
        console.log('user connected' + username);
        users.set(socket, {username: username, usercolor: usercolor}); 
        userlist.push(username);
        io.emit('change_userlist', userlist);
    });

    socket.on('chat', function(msg){
        var current_date = new Date(); 
        var firstWord = msg.message.split(' ')[0];

        if (firstWord === "/nick") {
            var secondWord = msg.message.split(' ')[1];
            console.log(secondWord);
            var nameExists = false;
            users.forEach(function(user, socket){
                if(user.username === secondWord) {
                    nameExists = true;
                }
            });
            if (!nameExists) {
                users.set(socket, {username: secondWord, usercolor: users.get(socket).usercolor}); 
                socket.emit('change_username_cookie', secondWord);
                userlist[userlist.indexOf(msg.name)] = secondWord;
                io.emit('change_userlist', userlist);
            }
        }
        if (firstWord === "/nickcolor") {
            var secondWord = msg.message.split(' ')[1];
            users.set(socket, {username: users.get(socket).username, usercolor: secondWord}); 
            socket.emit('change_usercolor_cookie', secondWord);
        }

        // send to self
        socket.emit('chat', {message: msg.message, date: current_date, name: msg.name, color: msg.color, style: "bold"});
        // send to all clients except sender
        socket.broadcast.emit('chat', {message: msg.message, date: current_date, name: msg.name, color: msg.color});
    });

    socket.on('disconnected', function(username){
        console.log('user disconnected' + username);
    });
});

app.use(express.static(__dirname + '/public'));
