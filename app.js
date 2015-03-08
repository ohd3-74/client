var mraa = require('mraa');
var μs = require('microseconds');

const NUM_LEDS = 1;

const HIGH = 1;
const LOW  = 0;

const _CL_RED          = 0;
const _CL_GREEN        = 1;
const _CL_BLUE         = 2;
const _CLK_PULSE_DELAY = 20;

var _clk_pin  = new mraa.Gpio(7);
var _data_pin = new mraa.Gpio(8);

var _num_leds = NUM_LEDS;

var _led_state = new Array(_num_leds*3);

var red = pos = 0;
var blue = green = 0;

init();

setInterval(function() {
	for (i=0; i<NUM_LEDS; i++)
	{
//		if (i==pos)
			setColorRGB(i, red, green, blue);  
//		else
//			setColorRGB(i, 0, 0, 0); 
	}
	//pos = (pos+1) % NUM_LEDS;
	pos = ! pos;
}, 20);

//var mic = require('microphone');

var spawn = require('child_process').spawn;
var arecord = spawn('arecord', ['-D', 'plughw:1']);

var WaveRead = require('./WaveRead');

WaveRead(arecord.stdout, function(data) {
	//console.log(data);
	
	//emg
	if(data > 250){
		red = data/2;
		blue = green = 0;
		if(data > 400){red = 255;}
	//calling 
	}else if(data > 0){
		red = green = 0;
	
		blue = 255;
	}else{
		blue = red = 0;
		green = 255;
	}
}
, 5);

function init()
{
	_clk_pin.dir(mraa.DIR_OUT);
	_data_pin.dir(mraa.DIR_OUT);

	for (i=0; i<_num_leds; i++)
		setColorRGB(i, 0, 0, 0);
}

function clk()
{
	digitalWrite(_clk_pin, LOW);
	delayMicroseconds(_CLK_PULSE_DELAY); 
	digitalWrite(_clk_pin, HIGH);
	delayMicroseconds(_CLK_PULSE_DELAY);
}

function sendByte(b)
{
	// Send one bit at a time, starting with the MSB
	for (i=0; i<8; i++)
	{
		// If MSB is 1, write one and clock it, else write 0 and clock
		if ((b & 0x80) != 0)
			digitalWrite(_data_pin, HIGH);
		else
			digitalWrite(_data_pin, LOW);
		clk();
	
		// Advance to the next bit to send
		b <<= 1;
	}
}

function sendColor(red, green, blue)
{
	// Start by sending a byte with the format "1 1 /B7 /B6 /G7 /G6 /R7 /R6"
	var prefix = 11000000;
	if ((blue & 0x80) == 0)     prefix|= 00100000;
	if ((blue & 0x40) == 0)     prefix|= 00010000; 
	if ((green & 0x80) == 0)    prefix|= 00001000;
	if ((green & 0x40) == 0)    prefix|= 00000100;
	if ((red & 0x80) == 0)      prefix|= 00000010;
	if ((red & 0x40) == 0)      prefix|= 00000001;
	sendByte(prefix);
    
	// Now must send the 3 colors
	sendByte(blue);
	sendByte(green);
	sendByte(red);
}

function setColorRGB(led, red, green, blue)
{
	// Send data frame prefix (32x "0")
	sendByte(0x00);
	sendByte(0x00);
	sendByte(0x00);
	sendByte(0x00);
	
	// Send color data for each one of the leds
	for (i=0; i<_num_leds; i++)
	{
		if (i == led)
		{
			_led_state[i*3 + _CL_RED] = red;
			_led_state[i*3 + _CL_GREEN] = green;
			_led_state[i*3 + _CL_BLUE] = blue;
		}
		            
		sendColor(_led_state[i*3 + _CL_RED], 
		          _led_state[i*3 + _CL_GREEN], 
		          _led_state[i*3 + _CL_BLUE]);
	}
	
	// Terminate data frame (32x "0")
	sendByte(0x00);
	sendByte(0x00);
	sendByte(0x00);
	sendByte(0x00);
}

function setColorHSB(led, hue, saturation, brightness)
{
    var r, g, b;
    
    constrain(hue, 0.0, 1.0);
    constrain(saturation, 0.0, 1.0);
    constrain(brightness, 0.0, 1.0);

    if(saturation == 0.0)
    {
        r = g = b = brightness;
    }
    else
    {
        var q = brightness < 0.5 ? 
            brightness * (1.0 + saturation) : brightness + saturation - brightness * saturation;
        var p = 2.0 * brightness - q;
        r = hue2rgb(p, q, hue + 1.0/3.0);
        g = hue2rgb(p, q, hue);
        b = hue2rgb(p, q, hue - 1.0/3.0);
    }

    setColorRGB(led, (255.0*r), (255.0*g), (255.0*b));
}

// --------------------------------------------------------------------------------------

function hue2rgb(p, q, t)
{
    if (t < 0.0) 
        t += 1.0;
    if(t > 1.0) 
        t -= 1.0;
    if(t < 1.0/6.0) 
        return p + (q - p) * 6.0 * t;
    if(t < 1.0/2.0) 
        return q;
    if(t < 2.0/3.0) 
        return p + (q - p) * (2.0/3.0 - t) * 6.0;

    return p;
}

function digitalWrite(pin, value) {
	pin.write(value);
}

function delayMicroseconds(ms) {
	start = μs.now();
	while (true) {
		if (μs.since(start) > ms) {
			return;
		}
	}
}

