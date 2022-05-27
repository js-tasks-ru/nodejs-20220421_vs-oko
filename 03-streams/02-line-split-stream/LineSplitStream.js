const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    this.data += chunk;
    const dataStr = this.data.toString();
    if (dataStr.includes(os.EOL)) {
      const dataArr = dataStr.split(os.EOL);
      this.data = dataArr.pop();
      dataArr.forEach((chunk) => this.push(chunk));
    }
    callback();
  }

  _flush(callback) {
    if (this.data) this.push(this.data);
    callback();
  }
}

module.exports = LineSplitStream;
