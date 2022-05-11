const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'DELETE':

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
  }

  const filepath = path.join(__dirname, 'files', pathname);

  fs.stat(filepath, (err) => {
    if (err == null) {
      fs.unlink(filepath, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end('unknown error');
        } else {
          console.log(pathname, 'was deleted');
          res.statusCode = 200;
          res.end(pathname + ' was deleted');
        }
      });
    } else if (err.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('file not found');
    }
  });
});

module.exports = server;
