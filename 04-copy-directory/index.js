const { createReadStream, createWriteStream } = require('fs');
const {readdir, mkdir, rm, access, constants } = require('fs/promises');
const {join} = require('path');
const { pipeline } = require('stream/promises');

const source = join(__dirname, 'files');
const destination = join(__dirname, 'files-copy');

async function isExist(path) {
  try{
    await access(path, constants.R_OK | constants.W_OK);
    return true;
  }
  catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
}

async function copyDir(source, destination) {
  try {
    const dirExists = await isExist(destination);
    if (dirExists) await rm(destination, {recursive: true});
    await mkdir(destination);

    const sourceContent = await readdir(source, {withFileTypes: true});
    sourceContent.forEach(async(item) => {
      const pathToOriginal = join(source, item.name);
      const pathToCopy = join(destination, item.name);
      if (item.isDirectory()) return await copyDir(pathToOriginal, pathToCopy);
      await pipeline(
        createReadStream(pathToOriginal),
        createWriteStream(pathToCopy)
      );
    });
  }
  catch (err) {
    console.log(err.message);
  }
}

copyDir(source, destination);
