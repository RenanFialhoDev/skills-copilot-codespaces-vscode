// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = [];
var server = http.createServer(function(req, res) {
    var parseUrl = url.parse(req.url, true);
    var pathname = parseUrl.pathname;
    if (pathname === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), function(err, data) {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.end('Not Found');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(data);
            }
        });
    } else if (pathname === '/comments') {
        if (req.method === 'GET') {
            var data = JSON.stringify(comments);
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            });
            res.end(data);
        } else if (req.method === 'POST') {
            var comment = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) {
                comment += chunk;
            });
            req.on('end', function() {
                comments.push(JSON.parse(comment));
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('{"status":"success"}');
            });
        }
    } else {
        fs.readFile(path.join(__dirname, pathname), function(err, data) {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.end('Not Found');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end(data);
            }
        });
    }
});
server.listen(3000);
console.log('Server running at http://localhost:3000/');