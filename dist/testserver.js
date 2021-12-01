// local http server for testing dist after building
// start server:  node testserver

var fs = require('fs'), http = require('http');
console.log('server is listening on localhost:8080');
http.createServer(function (req, res) {
    const url = req.url === '/' ? '/index.html' : req.url;
    fs.readFile(__dirname + url, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
})
    .listen(8080);
