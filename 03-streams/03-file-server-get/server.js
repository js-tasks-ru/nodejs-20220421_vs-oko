const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'GET':

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
  const url = new URL(req.url, `http://${req.headers.host}`);

  const pathname = url.pathname.slice(1);
  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('nested files are not supported');
  }
  const filepath = path.join(__dirname, 'files', pathname);

  const stream = fs.createReadStream(filepath);

  stream.on('error', (error) => {
    if (error.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('no such file');
    } else {
      res.statusCode = 500;
      res.end('Something went wrong');
    }
  });
  stream.pipe(res);

  res.on('aborted', () => stream.destroy());
});

module.exports = server;
