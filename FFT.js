/* http://rosettacode.org/wiki/Fast_Fourier_transform */
var fft = function(arr){
  var n = arr.length;
  if(n <= 1){return arr;}
 
  var h = n / 2;
  var even = [];
  var odd = [];
  even.length = h;
  odd.length = h;
  for(var i = 0; i < h; ++i){
    even[i] = arr[i*2];
    odd[i] = arr[i*2+1];
  }
  even = fft(even);
  odd = fft(odd);
 
  var a = -2*Math.PI;
  for(var k = 0; k < h; ++k){
    if(!(even[k] instanceof Complex)){
      even[k] = new Complex(even[k], 0);
    }
    if(!(odd[k] instanceof Complex)){
      odd[k] = new Complex(odd[k], 0);
    }
    var p = k/n;
    var t = new Complex(0, a * p);
    t.cexp(t).mul(odd[k], t);
    arr[k] = even[k].add(t, odd[k]);
    arr[k + h] = even[k].sub(t, even[k]);
  }
  return arr;
}

function Complex(re, im){
  this.re = re;
  this.im = im || 0.0;
}
Complex.prototype.add = function(other, dst){
  dst.re = this.re + other.re;
  dst.im = this.im + other.im;
  return dst;
}
Complex.prototype.sub = function(other, dst){
  dst.re = this.re - other.re;
  dst.im = this.im - other.im;
  return dst;
}
Complex.prototype.mul = function(other, dst){
  //cache re in case dst === this
  var r = this.re * other.re - this.im * other.im;
  dst.im = this.re * other.im + this.im * other.re;
  dst.re = r;
  return dst;
}
Complex.prototype.cexp = function(dst){
  var er = Math.exp(this.re);
  dst.re = er * Math.cos(this.im);
  dst.im = er * Math.sin(this.im);
  return dst;
}
Complex.prototype.norm = function(){
  return Math.sqrt(this.re * this.re + this.im * this.im);
}

module.exports = fft;

