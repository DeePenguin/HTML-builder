const { createReadStream } = require('fs');
const {join} = require('path');
const { pipeline } = require('stream/promises');
const {stdout} = process;

const pathToFile = join(__dirname, 'text.txt');

(async () => {
  try {
    const stream = createReadStream(pathToFile);
    await pipeline(stream, stdout);
  } catch (err) {
    console.log(err.message);
  }
})();
