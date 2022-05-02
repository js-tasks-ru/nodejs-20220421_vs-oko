const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit ? options.limit : null;
    this.limitCounter = 0;
  }

  _transform(chunk, encoding, callback) {
    this.limitCounter += Buffer.byteLength(chunk);
    let error = null;
    if (this.limit && this.limitCounter > this.limit) {
      error = new LimitExceededError();
    }
    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
