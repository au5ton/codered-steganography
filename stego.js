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
    for(var i = 0; i < data.length; i++) {
        data.charCodeAt(i).toString(2)
    }

    for(var i = 0; i < pixelArray.length; i++) {
        pixelArray[i].r
    }


};

//Takes a pixel array and encodes binary data into the pixel array
stego.decodeDataFromPixelArray = function(pixelArray) {


    for(var i = 0; i < pixelArray.length; i++) {
        //
    }


};



module.exports = stego;
