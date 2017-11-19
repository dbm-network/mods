const http = require('http');
const Stream = require('stream');
const ResponseStream = require('./ResponseStream');
const http2 = (() => {
  try {
    return require('http2');
  } catch (err) {
    return {
      constants: {},
      connect: () => {
        throw new Error('Please run node with --expose-http2 to use the http2 request transport');
      },
    };
  }
})();

const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_STATUS,
} = http2.constants;

class Http2Request extends Stream.Transform {
  constructor(options) {
    super();
    this.options = options;
    this.headers = {
      [HTTP2_HEADER_PATH]: options.pathname,
      [HTTP2_HEADER_METHOD]: options.method.toUpperCase(),
    };
  }

  setHeader(name, value) {
    this.headers[name.toLowerCase()] = value;
  }

  getHeader(name) {
    return this.headers[name];
  }

  end() {
    const options = this.options;
    const client = http2.connect(`${options.protocol}//${options.hostname}`);

    const req = client.request(this.headers);

    const stream = new ResponseStream();

    client.on('error', (e) => this.emit('error', e));
    client.on('frameError', (e) => this.emit('error', e));

    req.on('response', (headers) => {
      req.on('data', (chunk) => {
        if (!stream.push(chunk)) req.pause();
      });

      stream.headers = headers;
      stream.statusCode = headers[HTTP2_HEADER_STATUS];
      stream.status = http.STATUS_CODES[stream.statusCode];

      stream.on('error', (err) => {
        stream.statusCode = 400;
        stream.status = err.message;
      });

      this.emit('response', stream);
    });

    req.on('end', () => {
      this.emit('end');
      stream.emit('end');
      client.destroy();
    });

    return req;
  }
}


function request(options) {
  return new Http2Request(options);
}

module.exports = { request };
