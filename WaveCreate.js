var headArr = [
  82, 73, 70, 70, 36, 0, 0, -128, 87, 65, 86, 69, 102, 109, 116, 32,
  16, 0, 0, 0, 1, 0, 1, 0, 64, 31, 0, 0, 64, 31, 0, 0,
  1, 0, 8, 0, 100, 97, 116, 97, 0, 0, 0, -128
];
var headBuf = new Buffer(headArr);

process.stdout.write(headBuf);

var beep = function(hz, vol, sec){
  var size = 128;
  var sample = 16425;
  var loop = sec * sample;
  
  var r = Math.PI * 2 * hz / sample;
  console.error(r);
  
  var val = function(t){
    var v = Math.sin(t * r);
    return 128 + Math.floor(v * vol);
  };
  
  var buf = new Buffer(size);
  buf.fill(-128);
  
  for(var t = 0; t < loop; ++t){
    if(t != 0 && t % size == 0){
      process.stdout.write(buf);
      buf.fill(-128);
    }
    buf[t % size] = val(t);
  }
};

var vol = 40;
var len = 1;
beep(262, vol, len);
//beep(294, vol, len);
//beep(330, vol, len);
//beep(349, vol, len);
//beep(392, vol, len);
//beep(440, vol, len);
//beep(494, vol, len);
//beep(523, vol, len);
