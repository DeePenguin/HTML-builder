const { readdir, rm } = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const {join, parse} = require('path');
const { pipeline } = require('stream/promises');

const destination = join(__dirname, 'project-dist', 'bundle.css');
const sourceDir = join(__dirname, 'styles');

function isCssFile(source, file) {
  const pathToFile = join(source, file.name);
  return file.isFile() && parse(pathToFile).ext === '.css';
}

async function createCssBundle(source, destination) {
  const directoryContent = await readdir(source, {withFileTypes: true});
  const cssFiles = directoryContent.
    filter((item) => isCssFile(source, item)).
    map((item) => join(source, item.name));

  await rm(destination, { force: true});

  cssFiles.forEach(async (pathTofile) => {
    try {
      const rs = createReadStream(pathTofile);
      const ws = createWriteStream(destination, {flags: 'a'});
      await pipeline(rs, ws);
    } catch (err) {
      console.log(err);
    }
  });
}

createCssBundle(sourceDir, destination);
