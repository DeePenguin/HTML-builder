const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {stdin, stdout} = process;

const pathToFile = path.resolve(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(pathToFile,'utf8');
const rl = readline.createInterface({ input: stdin, output: writeStream });

const exit = () => {
  rl.close();
  stdout.write('Saved. Have a good day!\n');
  process.exit();
};

stdout.write('Type something to save it into file. Type "exit" to finish. \n');
rl.on('line', (data) => {
  if (data.trim().toLowerCase() === 'exit') exit();
  rl.output.write(`${data}\n`);
});

process.on('SIGINT', () => {
  exit();
});
