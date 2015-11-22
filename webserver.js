var fs = require('fs');
var PNG = require('pngjs').PNG;
var express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var app = express();

var stego = require('./stego');


app.use(express.static('static'));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/encode', function (req, res) {
    res.sendFile('encode.html', {root: './client'});
});

app.post('/encode', upload.array('photos', 2), function (req, res, next) {

    console.log(req.files);
    console.log(req.body);

    //Output directories
    var original_file_path = 'static/data/original_files/'+req.files[0].originalname;
    var encoded_file_path = 'static/data/processed_files/'+req.files[0].originalname;

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
                var stringified = JSON.stringify([req.files[1].originalname, buffer.toString('base64')]);
                processed = stego.encodeDataFromPixelArray(stego.parseImageBufferToPixelArray(this), stringified, 'text');
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

            var stream = this.pack().pipe(fs.createWriteStream(encoded_file_path));
            stream.on('finish', function(){
                res.redirect('/data/processed_files/'+req.files[0].originalname);
            });
        });
    });

});

app.get('/decode', function (req, res) {
    res.sendFile('decode.html', {root: './client'});
});

app.post('/decode', upload.single('original_image'), function (req, res, next) {

    console.log(req.file);
    console.log(req.body);


    //Process image file
    fs.createReadStream(req.file.path).pipe(new PNG({
        filterType: 4
    })).on('parsed', function() {

        var decoded = stego.decodeDataFromPixelArray(stego.parseImageBufferToPixelArray(this), req.body.expected_type);

        if(decoded.dataType === 'text') {
            res.send(decoded.data);
        }
        else {
            //console.log(decoded.data);
            var parsed = JSON.parse(decoded.data);
            //console.log(parsed);
            //parsed[0] file name
            //parsed[1] the buffer as a base64 string

            var temp_file_name = 'temp/'+req.filename+parsed[0];

            fs.mkdir('temp', function(){
                fs.writeFile(temp_file_name, new Buffer(parsed[1], 'base64'), 'binary', function(err){
                    res.setHeader('Content-disposition', 'attachment; filename='+parsed[0]);
                    res.sendFile(req.filename+parsed[0], {root: 'temp'}, function(){
                        //file transport done, delete the temp file
                        fs.unlink('temp/'+req.filename+parsed[0]);
                    });
                });
            });

        }
    });
});


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
