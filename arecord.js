var spawn = require('child_process').spawn;
var arecord = spawn('arecord', ['-D', 'plughw:1']);

arecord.stdout.on('data', function (data) {
	process.stdout.write(data);
});

