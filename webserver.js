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

app.get('/encode', function (req, res) {
    res.sendFile('encode.html', {root: './static'});
});

app.post('/encode', upload.array('photos', 2), function (req, res, next) {

    console.log(req.files);
    console.log(req.body);

    //Output directories
    var original_file_path = 'test_img/'+req.files[0].originalname;
    var encoded_file_path = 'test_img_out/'+req.files[0].originalname;

    fs.rename(req.files[0].path, original_file_path, function(){

        //Process image file
        fs.createReadStream(original_file_path).pipe(new PNG({
            filterType: 4
        })).on('parsed', function() {

            //stego.reformatPixelArrayToBufferData();

            var processed;
            if(req.body.encode_type === 'text') {
                console.log('Processing text.');
                processed = stego.encodeDataFromPixelArray(stego.parseImageBufferToPixelArray(this), req.body.text_data, 'text');
            }
            else if(req.body.encode_type === 'binary') {
                console.log('Processing a binary file.');
                var buffer = fs.readFileSync(req.files[1].path);
                processed = stego.encodeDataFromPixelArray(stego.parseImageBufferToPixelArray(this), buffer, 'binary');
            }
            else {
                console.log('something else??')
            }

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

            this.pack().pipe(fs.createWriteStream(encoded_file_path));

            res.json({
                old_file: original_file_path,
                new_file: encoded_file_path
            });
        });
    });

});

app.get('/decode', function (req, res) {
    res.sendFile('decode.html', {root: './static'});
});

app.post('/decode', upload.single('original_image'), function (req, res, next) {

    console.log(req.file);
    console.log(req.body);


    //Process image file
    fs.createReadStream(req.file.path).pipe(new PNG({
        filterType: 4
    })).on('parsed', function() {

        //stego.reformatPixelArrayToBufferData();

        var decoded = stego.decodeDataFromPixelArray(stego.parseImageBufferToPixelArray(this), req.body.expected_type);


        if(decoded.dataType === 'text') {
            res.send(decoded.data);
        }
        else {
            console.log('Binary:');
            //console.log(decoded.data);
            console.log('Buffer:');
            //console.log(new Buffer(decoded.data));
            res.send(new Buffer(decoded.data));
        }
    });
});


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
