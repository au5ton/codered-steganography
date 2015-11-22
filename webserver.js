var fs = require('fs');
var PNG = require('pngjs').PNG;
var express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var crypto = require('crypto');
var app = express();

var stego = require('./stego');


app.use(express.static('static'));
app.set('views', './views')
app.set('view engine', 'jade');

app.get('/', function (req, res) {
    res.sendFile('index.html', {root: './client'});
});

app.get('/encode', function (req, res) {
    res.sendFile('encode.html', {root: './client'});
});

app.post('/encode', upload.array('files', 2), function (req, res, next) {

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
            var pw = req.body.pw || null;
            var processed;
            if(req.body.encode_type === 'text') {
                var text = req.body.text_data;
                console.log('Processing text.');
                if (pw){
                    var encrypt = crypto.createCipher('aes-256-cbc', pw);
                    text = encrypt.update(text, 'utf8', 'binary') + encrypt.final('binary');
                }
                //console.log(text);
                processed = stego.encodeDataFromPixelArray(stego.parseImageBufferToPixelArray(this), text, 'text');
            }
            else if(req.body.encode_type === 'binary') {
                console.log('Processing a binary file.');
                var buffer = fs.readFileSync(req.files[1].path);
                var stringified = JSON.stringify([req.files[1].originalname, buffer.toString('binary')]);
                if (pw){
                    var encrypt = crypto.createCipher('aes-256-cbc', pw);
                    stringified = encrypt.update(stringified, 'binary', 'binary') + encrypt.final('binary');
                }
                processed = stego.encodeDataFromPixelArray(stego.parseImageBufferToPixelArray(this), stringified, 'text');
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
        var pw = req.body.pw || null;

        if(decoded.dataType === 'text') {
            var text = decoded.data;
            try {
                if (pw) {
                    var decrypt = crypto.createDecipher('aes-256-cbc', pw);
                    text = decrypt.update(text, 'binary', 'utf8') + decrypt.final('utf8');
                }
                //console.log(text)
                res.render('output', {
                    text: text
                });
            }
            catch (err) {
                res.render('error', {
                    text: 'Bad text password'
                });
            }
        }
        else {

            try {
                var data = decoded.data;
                if (pw) {
                    //console.log('entering try block, pw : ' + pw);
                    var decrypt = crypto.createDecipher('aes-256-cbc', pw);
                    //console.log('decrypt made');
                    data = decrypt.update(decoded.data, 'binary', 'binary') + decrypt.final('binary');
                }
                //console.log('data decoded');
                //console.log(data);
                var parsed = JSON.parse(data);
                //console.log('data parsed');
                //parsed[0] file name
                //parsed[1] the buffer as a base64 string
                var filename = parsed[0];
                data = new Buffer(parsed[1], 'binary');
                var temp_file_name = 'temp/'+req.filename+parsed[0];

                fs.mkdir('temp', function(){
                    fs.writeFile(temp_file_name, data, 'binary', function(err){
                        res.setHeader('Content-disposition', 'attachment; filename='+parsed[0]);
                        res.sendFile(req.filename+parsed[0], {root: 'temp'}, function(){
                            //file transport done, delete the temp file
                            fs.unlink('temp/'+req.filename+parsed[0]);
                        });
                    });
                });
            }
            catch (err) {
                res.render('error', {
                    text: 'Bad bin password'
                });
            }
        }
    });
});

var server = app.listen(process.env.PORT || 3000, function () {
    var host = process.env.HOST || '0.0.0.0';
    var port = process.env.PORT || 3000;

    console.log('Example app listening at http://%s:%s', host, port);
});
