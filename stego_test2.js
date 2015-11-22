var fs = require('fs');
var PNG = require('pngjs').PNG;
var stego = require('./stego');

console.log(process.argv);

if(process.argv[2] === '--parseImageBuffer') {
    fs.createReadStream(process.argv[3]).pipe(new PNG({
        filterType: 4
    })).on('parsed', function() {

        console.log(stego.parseImageBuffer(this));

    });
}
