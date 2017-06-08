import Model from './model.js';
import fs    from 'fs';

async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, text) => {
      resolve(text);
    });
  });
}

(async () => {
  try {
    const model = new Model(await readFile('./data/question.txt'), await readFile('./data/answer.txt'));
    console.log(model.calculateScore());
    
  } catch (e) {
    console.log(e);
  }
})();

