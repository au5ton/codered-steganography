var fs = require('fs');
var PNG = require('pngjs').PNG;
var express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var app = express();

var stego = require('./stego');


app.use('/static', express.static('static'));
app.use('/uploads', express.static('uploads'));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/generate', function (req, res) {
    res.sendFile('generate.html', {root: './static'});
});

app.post('/generate', upload.single('original_image'), function (req, res, next) {

    console.log(req.file);
    console.log(req.body);


    //Process image file
    fs.createReadStream(req.file.path).pipe(new PNG({
        filterType: 4
    })).on('parsed', function() {

        //stego.reformatPixelArrayToBufferData();

        var processed = stego.encodeDataFromPixelArray(stego.parseImageBufferToPixelArray(this), req.body.text_data);

        var n = 0;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;

                if(n < processed.length) {
                    this.data[idx] = processed[n].r;
                    this.data[idx+1] = processed[n].g;
                    this.data[idx+2] = processed[n].b;
                    this.data[idx+3] = processed[n].alpha;
                    n++;
                }

            }
        }

        this.pack().pipe(fs.createWriteStream(req.file.path+'_out.png'));

        res.json({
            old_file: req.file.path,
            new_file: req.file.path+'_out.png'
        });
    });
});


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
