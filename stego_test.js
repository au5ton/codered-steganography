var fs = require('fs');
var PNG = require('pngjs').PNG;

console.log(process.argv);

fs.createReadStream(process.argv[2]).pipe(new PNG({
    filterType: 4
})).on('parsed', function() {

    for (var y = 0; y < this.height; y++) {
        var str = "";
        for (var x = 0; x < this.width; x++) {

            var idx = (this.width * y + x) << 2;

            //str += '{r:'+this.data[idx]+', g:'+this.data[idx+1]+', b:'+this.data[idx+2]+', a:'+this.data[idx+3]+'}';
            str += 'a:'+this.data[idx+3]+', ';

            //this.data[idx] RED value
            //this.data[idx+1] GREEN value
            //this.data[idx+2] BLUE value
            //this.data[idx+3] ALPHA value
        }
        console.log(str);
    }

});
