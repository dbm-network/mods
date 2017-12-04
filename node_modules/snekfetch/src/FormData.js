const path = require('path');
const mime = require('./mime');

class FormData {
  constructor() {
    this.boundary = `--snekfetch--${Math.random().toString().slice(2, 7)}`;
    this.buffers = [];
  }

  append(name, data, filename) {
    if (typeof data === 'undefined') return;
    let str = `\r\n--${this.boundary}\r\nContent-Disposition: form-data; name="${name}"`;
    let mimetype = null;
    if (filename) {
      str += `; filename="${filename}"`;
      mimetype = 'application/octet-stream';
      const extname = path.extname(filename).slice(1);
      if (extname) mimetype = mime.lookup(extname);
    }

    if (data instanceof Buffer) {
      mimetype = mime.buffer(data);
    } else if (typeof data === 'object') {
      mimetype = 'application/json';
      data = Buffer.from(JSON.stringify(data));
    } else {
      data = Buffer.from(String(data));
    }

    if (mimetype) str += `\r\nContent-Type: ${mimetype}`;
    this.buffers.push(`${str}\r\n\r\n`);
    this.buffers.push(data);
  }

  end() {
    this.buffers.push(`\r\n--${this.boundary}--`);
    return this.buffers;
  }

  get length() {
    return this.buffers.reduce((sum, b) => sum + Buffer.byteLength(b), 0);
  }
}

module.exports = FormData;
