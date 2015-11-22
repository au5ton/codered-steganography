var stego = {};


//Takes a png.js image buffer and turns it into a pixel array
stego.parseImageBufferToPixelArray = function(buffer) {

    var image = [];

    for (var y = 0; y < buffer.height; y++) {
        for (var x = 0; x < buffer.width; x++) {
            var idx = (buffer.width * y + x) << 2;
            image.push({r: buffer.data[idx], g: buffer.data[idx+1], b: buffer.data[idx+2], alpha: buffer.data[idx+3]});
        }
    }

    return image;
};


stego.encodeDataFromBuffer = function(buffer, data) {

    for(var i = 0; i < buffer.data.length; i++) {
        
    }
    
};

stego.decodeDataFromBuffer = function(buffer, data) {

};






//Takes a pixel array and encodes binary data into the pixel array
stego.encodeDataFromPixelArray = function(pixelArray, data) {

    var binaryArrayOfData = [];
    var pixel, byte;
    for(var i = 0; i < data.length; i++) {
        byte = data[i].charCodeAt(1);
        pixel = pixelArray[i];
        encodeByteInPixel(pixel, byte);
    }

};

stego.encodeByteInPixel = function(pixel, byte) {
    var bit;
    for (var i = 0; i < 8; i++) {
        // get value of bit
        if (byte & (1 << 7-i)) {
            bit = 1;
        }
        else {
            bit = 0;
        }
        
        // encode bit in appropriate position in appropriate channel
        if (i == 0 || i == 1) {
            encodeBitInChannel(pixel, 'r', bit, i);
        }
        else if (i == 2 || i == 3) {
            encodeBitInChannel(pixel, 'g', bit, i % 2);
        }
        else if (i == 4 || i == 5) {
            encodeBitInChannel(pixel, 'b', bit, i % 2);
        }
        else {
            // position-1 to do LSBs 2 and 1 instead of 1 and 0
            encodeBitInChannel(pixel, 'alpha', bit, (i % 2)-1);
        }
    }
};

stego.encodeBitInChannel = function(pixel, channel, bit, position) {
    if (bit) {
        // set bit to 1
        pixel[channel] |= (1 << 1-position);
    }
    else {
        // set bit to 0
        pixel[channel] &= ~(1 << 1-position);
    }
};

//Takes a pixel array and encodes binary data into the pixel array
stego.decodeDataFromPixelArray = function(pixelArray) {


    for(var i = 0; i < pixelArray.length; i++) {
        //
    }


};



module.exports = stego;
