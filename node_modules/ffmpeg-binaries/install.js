'use strict';

const fs = require('fs');
const targz = require('tar.gz');
const superagent = require('superagent');

let request;
if (process.platform === 'win32') {
  request = superagent.get('https://github.com/Hackzzila/node-ffmpeg-binaries/blob/master/windows.tar.gz?raw=true');
} else if (process.platform === 'linux') {
  request = superagent.get('https://github.com/Hackzzila/node-ffmpeg-binaries/blob/master/linux.tar.gz?raw=true');
} else if (process.platform === 'darwin') {
  request = superagent.get('https://github.com/Hackzzila/node-ffmpeg-binaries/blob/master/darwin.tar.gz?raw=true');
}

console.log('Downloading')
request.pipe(fs.createWriteStream('./bin.tar.gz'));

request.on('end', () => {
  console.log('Extracting');
  targz().extract('./bin.tar.gz', 'bin')
    .then(() => console.log('Done!'))
    .catch((err) => {
      throw err;
    });
});