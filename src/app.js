import fs    from 'fs';
import R     from 'ramda';
import score from './scorekeeper.js';

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, text) => {
      resolve(text);
    });
  });
}

Promise.all([readFile(process.argv[2]), readFile(process.argv[3])]).then((values) => {
  console.log(R.apply(score)(values));
});
