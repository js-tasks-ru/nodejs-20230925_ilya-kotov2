const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.sumChunkSize = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.sumChunkSize += Buffer.byteLength(chunk);

    if (this.sumChunkSize > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    };
  }
}

module.exports = LimitSizeStream;
