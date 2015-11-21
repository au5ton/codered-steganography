var stego = {};



stego.parseImageBuffer = function(buffer) {

    var image = [];

    for (var y = 0; y < buffer.height; y++) {
        for (var x = 0; x < buffer.width; x++) {
            var idx = (buffer.width * y + x) << 2;
            image.push({r: buffer.data[idx], g: buffer.data[idx+1], b: buffer.data[idx+2], alpha: buffer.data[idx+3]});
        }
    }

    return image;
};



module.exports = stego;
