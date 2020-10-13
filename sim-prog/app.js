var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html'),
    Jimp = require('jimp'),
    AWS = require('aws-sdk'),
    async = require('async');

var bucketNameUpload = 'NAME BUCKET UPLOAD';
var bucketNameResult = 'NAME BUCKET RESULT';
var s3 = new AWS.S3({
    accessKeyId: 'ACCESSKEY',
    /* key */
    secretAccessKey: 'SECRETKEY',
    params: { Bucket: bucketNameUpload },
    region: 'eu-central-1'
});
var s3Result = new AWS.S3({
    accessKeyId: 'ACCESSKEY',
    /* key */
    secretAccessKey: 'SECRETKEY',
    params: { Bucket: bucketNameResult },
    region: 'eu-central-1'
});

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var done = function(err, data) {
    if (err) console.log(err);
    else console.log(data);
};

var server = http.createServer(function(req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            res.end();
        });
    } else {

        if (req.url === '/start') {

            s3.listObjects(function(err, data) {
                if (data.Contents.length) {
                    async.each(data.Contents, function(file, cb) {
                        var params = {
                            Bucket: bucketNameUpload,
                            // CopySource: bucketNameUpload + '/' + file.Key,
                            Key: file.Key
                        };


                        s3.getObject(params, function(err, data) {

                            var fileNew = manipulate(data.Body);

                            fileNew.then(f => {
                                console.log(f);


                                var params = {
                                    Bucket: bucketNameResult,
                                    // CopySource: bucketNameUpload + '/' + file.Key,
                                    Key: file.Key,
                                    Body: f
                                };

                                s3Result.upload(params, function(err, copyData) {
                                    if (err) {
                                        console.log(err);
                                        cb(err);
                                    } else {
                                        console.log('Uploaded: ', params.Key);
                                    }
                                });
                            });
                        });


                    }, done);
                }
            });
        }

        res.writeHead(200);
        res.write(html);
        res.end();
    }
});

async function manipulate(img, name) {
    const fileNew = await Jimp.read(img)
        .then(async image => {
            const background = await Jimp.read('https://cdn.hipwallpaper.com/i/1/43/JdiB08.jpg');
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

            image.resize(Jimp.AUTO, 900);
            image.composite(background, 1000, 700);
            image.print(font, 1000, 700, 'CAT');
            image.color([{ apply: 'red', params: [100] }]);

            return image.getBufferAsync(Jimp.AUTO);
        })
        .catch(err => {
            res.status(500).json({ msg: 'Server Error', error: err });
        });

    return fileNew;
}



// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');