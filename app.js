var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nicknames = [];

var Chat = require('./db');

app.get("/",function(req, res) {
    res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(socket) {
    var query = Chat.find({});
    query.sort('-created').exec(function (err, docs) {
        if(err) throw err;
        socket.emit("load old msgs", docs);
    });

    socket.on('new user', function(data, callback) {
        if (nicknames.indexOf(data)!=-1) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            updateNicknames();
        }
    });

    socket.on('message', function(message) {
        var newMsg = new Chat({msg: message, nick:socket.nickname});
        newMsg.save(function (err) {
            if (err) throw err;
            io.sockets.emit('message', {msg: message, nick:socket.nickname});
        });

    });

    socket.on('disconnect', function(data) {
        if(!socket.nickname) return;
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        updateNicknames()
    });

    function updateNicknames() {
        io.sockets.emit('usernames', nicknames);
    }
});

http.listen(3000, function () {
    console.log("Listening 3000");
});

