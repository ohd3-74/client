
if( process.argv.length < 3 ) {
	console.log(
		'Usage: \n' +
		'node client.js <host> [<port>]'
	);
	process.exit();
}

var host = process.argv[2];
var port = process.argv[3] || 8080;

var io = require('socket.io-client');
var ss = require('socket.io-stream');
var mic = require('microphone');
 
console.log('connect to ' + host + ':' + port);

var socket = io.connect('ws://' + host + ':' + port);
var stream = ss.createStream();

socket.on('connect', function() {
	console.log('connect');
	ss(socket).emit('stream-audio', stream);
	mic.startCapture();
	mic.audioStream.pipe(stream);
});

socket.on('disconnect', function() {
	console.log('disconnect');
});

