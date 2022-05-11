const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'POST':

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
      return;
  }
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('nested files are not supported');
    return;
  }
  const filepath = path.join(__dirname, 'files', pathname);

  fs.readFile(filepath, (err) => {
    if (err == null) {
      res.statusCode = 409;
      res.end('File exists');
    } else if (err.code === 'ENOENT') {
      const limitedStream = new LimitSizeStream({limit: 8e5});

      limitedStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          console.log(err.code);
          res.statusCode = 413;
          res.end(err.code, delFile(filepath));
        } else {
          res.statusCode = 500;
          res.end('Something went wrong');
        }
      });
      req.on('aborted', () => {
        delFile(filepath);
        outStream.destroy();
        limitedStream.destroy();
      });
      function delFile(filepath) {
        fs.unlink(filepath, (err) => {
          if (err) throw err;
          console.log(pathname, 'was deleted');
        })
      }
      const outStream = fs.createWriteStream(filepath);
      req.pipe(limitedStream).pipe(outStream);
      outStream.on('finish', () => {
        res.statusCode = 201;
        res.end()
      })
    } else {
      console.log('Some other error: ', err.code);
    }
  });
});

module.exports = server;
