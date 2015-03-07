var fft = require('./FFT');

var data = [];

var counter = 0;
var bc = 0;
var arr = [];

var size = 1024;

process.stdin.on('data', function(chunk){
  if(chunk == ''){return;}
  for(var i = 0; i < chunk.length; ++i, ++counter){
    if(counter < 43){continue;}
    arr[bc++] = chunk[i] - 128;
    if(bc >= size){
      var datum = fft(arr);
      var s = [];
      var max = 0;
      for(var j = 0; j < datum.length/2; ++j){
        s[j] = datum[j].norm() / size;
        if(s[j] > 10){
          max = j;
        }
      }
      var buf = new Buffer(1);
      buf[0] = max;
      process.stdout.write(buf);
      process.stdout.write('\n');
      data.push(s);
      bc = 0;
      arr = [];
    }
  }
});

//process.stdin.pipe(process.stdout);
process.stdin.resume();

