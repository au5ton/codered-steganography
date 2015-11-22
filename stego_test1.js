var fs = require('fs');
var PNG = require('pngjs').PNG;
var stego = require('./stego');

console.log(process.argv);

//Dif needs to be a positive number
function safeSubtract(n,dif) {
    if(n-dif < 0) {
        n = 0;
    }
    else {
        n -= dif;
    }
    return n;
}

if(process.argv[2] === '--checkAlpha') {
    fs.createReadStream(process.argv[3]).pipe(new PNG({
        filterType: 4
    })).on('parsed', function() {

        for (var y = 0; y < this.height; y++) {
            var str = "";
            for (var x = 0; x < this.width; x++) {

                var idx = (this.width * y + x) << 2;

                //str += '{r:'+this.data[idx]+', g:'+this.data[idx+1]+', b:'+this.data[idx+2]+', a:'+this.data[idx+3]+'}';
                str += 'a:'+this.data[idx+3]+', ';


                // invert color
                //this.data[idx] RED value
                //this.data[idx+1] GREEN value
                //this.data[idx+2] BLUE value

                // and reduce opacity
                //this.data[idx+3] ALPHA value
            }
            console.log(str);
        }

    });
}
else if(process.argv[2] === '--getPixels') {
    fs.createReadStream(process.argv[3]).pipe(new PNG({
        filterType: 4
    })).on('parsed', function() {

        for (var y = 0; y < this.height; y++) {
            console.log('Y: '+y);
            for (var x = 0; x < this.width; x++) {

                var idx = (this.width * y + x) << 2;

                console.log('{r:'+this.data[idx]+', g:'+this.data[idx+1]+', b:'+this.data[idx+2]+', a:'+this.data[idx+3]+'}');


                // invert color
                //this.data[idx] RED value
                //this.data[idx+1] GREEN value
                //this.data[idx+2] BLUE value

                // and reduce opacity
                //this.data[idx+3] ALPHA value
            }
            console.log('\n');
        }

    });
}
else if(process.argv[2] === '--writeRed') {

    fs.createReadStream(process.argv[3]).pipe(new PNG({
        filterType: 4
    })).on('parsed', function() {

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;
                this.data[idx] = 255;
                this.data[idx+3] = 128;
            }
        }

        this.pack().pipe(fs.createWriteStream(process.argv[4]));

    });
}
else if(process.argv[2] === '--offset') {

    fs.createReadStream(process.argv[3]).pipe(new PNG({
        filterType: 4
    })).on('parsed', function() {

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;

                this.data[idx] = safeSubtract(this.data[idx],parseInt(process.argv[5])); //red
                this.data[idx+1] = safeSubtract(this.data[idx+1],parseInt(process.argv[5])); //green
                this.data[idx+2] = safeSubtract(this.data[idx+2],parseInt(process.argv[5])); //blue
                this.data[idx+3] = safeSubtract(this.data[idx+3],parseInt(process.argv[5])); //alpha
            }
        }

        this.pack().pipe(fs.createWriteStream(process.argv[4]));

    });
}
