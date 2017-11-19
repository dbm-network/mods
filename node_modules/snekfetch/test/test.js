/* eslint-disable no-console */
const snekfetch = require('../index');
// const fs = require('fs');

// snekfetch.get('https://s.gus.host/o-SNAKES.jpg').pipe(fs.createWriteStream('out.jpg'));
// snekfetch.get('https://discordapp.com/assets/b9411af07f154a6fef543e7e442e4da9.mp3')
//   .pipe(fs.createWriteStream('ring.mp3'));

snekfetch.get('https://httpbin.org/redirect/1')
  .set('X-Boop-Me', 'Dream plz')
  .query({ a: 1, b: 2 })
  .query('c', 3)
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .then(() => console.log('test 1 success'));

snekfetch.post('http://strawpoll.me/api/v2/polls')
  .send({ title: 'snekfetch', options: ['1', '2'] })
  .then(() => console.log('test 2 success'));

snekfetch.get('file://../package.json')
  .then(() => console.log('test 3 success'));

snekfetch.get('file://../nonexistant')
  .catch(() => console.log('test 4 success'));

snekfetch.post('https://httpbin.org/post')
  .attach('test', 'test content')
  .then(() => console.log('test 5 success'));

snekfetch.post('file://./post_test.json')
  .send({ meme: 'dream' })
  .then(() => {
    console.log('test 6 success');
    snekfetch.delete('file://./post_test.json')
      .then(() => console.log('test 7 success'));
  });

snekfetch.get('https://http2.akamai.com/demo', { version: 2 })
  .then((r) => console.log('test 8 success'));
