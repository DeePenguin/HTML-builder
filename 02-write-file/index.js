const {createWriteStream} = require('fs');
const {join} = require('path');
const {createInterface} = require('readline');
const {stdin, stdout} = process;

const pathToFile = join(__dirname, 'text.txt');

const writeStream = createWriteStream(pathToFile,'utf8');
const rl = createInterface({ input: stdin, output: writeStream });

const exit = () => {
  rl.close();
  stdout.write('Saved. Have a good day!\n');
  process.exit();
};

stdout.write('Type something to save it into file. Type "exit" to finish. \n');
rl.on('line', (data) => {
  if (data.toString().trim().toLowerCase() === 'exit') exit();
  rl.output.write(`${data}\n`);
});

process.on('SIGINT', () => {
  exit();
});
