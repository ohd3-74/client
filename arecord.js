var spawn = require('child_process').spawn;
//var arecord = spawn('arecord', ['-D', 'plughw:1']);
var arecord = spawn('arecord', ['-f', 'S16_LE', '-c1', '-r16000', '-D', 'plughw:1']);

arecord.stdout.on('data', function (data) {
	process.stdout.write(data);
});

