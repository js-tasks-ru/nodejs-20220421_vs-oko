const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('nested files are not supported');
  }
  const filepath = path.join(__dirname, 'files', pathname);
  fs.stat(filepath, (err) => {
    if (err == null) {
      res.statusCode = 409;
      res.end('File exists');
    } else if (err.code === 'ENOENT') {
      const limitedStream = new LimitSizeStream({limit: 1e6});
      limitedStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end(err.code);
        } else {
          res.statusCode = 500;
          res.end('Something went wrong');
        }
      });
      req.on('aborted', (err) => {
        if (err) throw err;
        console.log('file.txt was deleted');
        outStream.destroy();
        limitedStream.destroy();
      });
      const outStream = fs.createWriteStream(filepath);
      req.pipe(limitedStream).pipe(outStream);
    } else {
      console.log('Some other error: ', err.code);
    }
  });

  switch (req.method) {
    case 'POST':

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
