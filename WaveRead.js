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
    //console.error(chunk[i]);
    arr[bc++] = chunk[i] - 128;
    if(bc >= size){
      var datum = fft(arr);
      var s = [];
      for(var j = 0; j < datum.length/2; ++j){
        s[j] = datum[j].norm() / size;
        console.error(j + ': ' + Array(~~s[j]+1).join('*'));
      }
      data.push(s);
      bc = 0;
      arr = [];
    }
  }
});

//process.stdin.pipe(process.stdout);
process.stdin.resume();

