'use strict';

const path = require('path');

module.exports = {};

module.exports.binPath = () => path.join(__dirname, 'bin');
module.exports.ffmpegPath = () => path.join(__dirname, 'bin', 'ffmpeg');
module.exports.ffprobePath = () => path.join(__dirname, 'bin', 'ffprobe');

module.exports.ffplayPath = () => {
  if (process.platform === 'win32') return path.join(__dirname, 'bin', 'ffplay');
  throw new Error('ffplay is only supported on Windows');
}

module.exports.ffserverPath = () => {
  if (process.platform === 'linux' || process.platform === 'darwin') return path.join(__dirname, 'bin', 'ffserver');
  throw new Error('ffplay is only supported on Linux or macOS');
}
