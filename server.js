var io = require('socket.io')();
var ss = require('socket.io-stream');
var fs = require('fs');

var port = 8080;

io.on('connection', function (socket) {
    ss(socket).on('stream-audio', function(stream) {
        console.log('stream-audio');
        stream.pipe(fs.createWriteStream(Date.now() + ".wav", { flags: 'a' }));
    });
});

io.listen(port);

