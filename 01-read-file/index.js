const fs = require('fs');
const path = require('path');
const {stdout} = process;

const pathToFile = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(pathToFile);
stream.pipe(stdout);
