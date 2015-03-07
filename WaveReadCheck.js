// node WaveCreate.js | node WaveReadCheck.js

var WaveRead = require('./WaveRead');

WaveRead(process.stdin, function(val){console.log(val);}, 10);
