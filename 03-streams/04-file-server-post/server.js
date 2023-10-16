const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');


const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);


  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('Invalid directory');
    res.on('error', (error) => {
      console.log('Ошибка пути');
    });
  }

  fs.stat(filepath, (err, stat) => {
    if (!err) {
      res.statusCode = 409;
      res.end('The file already exists');
      req.push(null);
    }
  });

  const limitedStream = new LimitSizeStream({limit: 10, encoding: 'utf-8'});

  switch (req.method) {
    case 'POST':
      const stream = fs.createWriteStream(filepath);

      stream.on('open', () => {
        req
            .pipe(limitedStream)
            .on('error', (error) => {
              if (error.code === 'LIMIT_EXCEEDED') {
                res.statusCode = 413;
                res.end('LIMIT_EXCEEDED');
              } else {
                res.statusCode = 500;
                res.end('Server error');
              }
            })
            .pipe(stream);

            res.end('File created');
      });


      req.on('aborted', () => {
        stream.destroy();
        fs.rm( pathname );
      });


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
