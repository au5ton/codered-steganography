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


stego.reformatPixelArrayToBufferData = function(pixelArray) {

    var bufferData = [];
    for(var i = 0; i < pixelArray; i++) {
        bufferData.push(pixelArray[i].r);
        bufferData.push(pixelArray[i].g);
        bufferData.push(pixelArray[i].b);
        bufferData.push(pixelArray[i].alpha);
    }

};


//Takes a pixel array and encodes binary data into the pixel array
stego.encodeDataFromPixelArray = function(pixelArray, data) {

    var encodedPixelArray = pixelArray;
    var pixel, byte;
    for(var i = 0; i < data.length; i++) {
        byte = data[i].charCodeAt(1);
        pixel = pixelArray[i];
        pixel = stego.encodeByteInPixel(pixel, byte);
        if (i == data.length-1) {
            pixel['alpha'] |= (1 << 0);
        }
        else {
            pixel['alpha'] &= ~(1 << 0);
        }
        encodedPixelArray[i] = pixel;
    }
    return encodedPixelArray;
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
            pixel = stego.encodeBitInChannel(pixel, 'r', bit, i);
        }
        else if (i == 2 || i == 3) {
            pixel = stego.encodeBitInChannel(pixel, 'g', bit, i % 2);
        }
        else if (i == 4 || i == 5) {
            pixel = stego.encodeBitInChannel(pixel, 'b', bit, i % 2);
        }
        else {
            // position-1 to do LSBs 2 and 1 instead of 1 and 0
            pixel = stego.encodeBitInChannel(pixel, 'alpha', bit, (i % 2)-1);
        }
    }
    console.log(pixel);
    return pixel;
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
    console.log("Encoding " + bit + " in channel " + channel + " in position " + position);
    return pixel;
};

//Takes a pixel array and encodes binary data into the pixel array
stego.decodeDataFromPixelArray = function(pixelArray) {


    for(var i = 0; i < pixelArray.length; i++) {
        //
    }


};



module.exports = stego;
