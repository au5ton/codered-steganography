var fs = require('fs');
var PNG = require('pngjs').PNG;
var stego = require('./stego');

console.log(process.argv);

if(process.argv[2] === '--decodeText') {
    fs.createReadStream(process.argv[3]).pipe(new PNG({
        filterType: 4
    })).on('parsed', function() {
        console.log('Decoded text from given image:');
        console.log(stego.decodeDataFromPixelArray(stego.parseImageBufferToPixelArray(this)))
    });
}
