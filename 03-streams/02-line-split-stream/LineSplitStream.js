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
      const dataArr = dataStr.split(os.EOL).slice(0, -1);
      dataArr.forEach((chunk) => this.push(chunk));
      this.data = dataStr.split(os.EOL).slice(-1)[0];
    }
    callback();
  }

  _flush(callback) {
    this.push(this.data);
    this._destroy(null, callback);
  }
}

module.exports = LineSplitStream;


