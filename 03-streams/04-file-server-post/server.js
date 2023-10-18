const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');


const receiveFile = require('./receiveFile');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);


  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  

  switch (req.method) {
    case 'POST':
<<<<<<< HEAD
      const limitedStream = new LimitSizeStream({limit: 1e6});
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

      req.pipe(limitedStream).pipe(writeStream);

      writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File exists');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
          fs.unlink(filepath, (error) => {});
        }
      });

      limitedStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('File is too big');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }

        fs.unlink(filepath, (err) => {});
      })

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('file has been saved');
      })

      req.on('aborted', () => {
        fs.unlink(filepath, (error) => {});
      });
=======
      if (!filepath) {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }

      receiveFile(filepath, req, res);
>>>>>>> e55dbff3ea423ec6e2ff97051b943aced2b74a69

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
