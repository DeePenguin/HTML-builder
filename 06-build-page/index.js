const { readdir, rm, mkdir, access, constants } = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const {join, parse} = require('path');
const { pipeline } = require('stream/promises');

const destination = join(__dirname, 'project-dist');


async function createDir(destination) {
  try{
    await mkdir(destination, { recursive: true });
  }
  catch (err) {
    console.log(err);
  }
}

async function clearDir(destination) {
  const content = await readdir(destination, {withFileTypes: true});
  content.forEach(async (item) => {
    const pathToItem = join(destination, item.name);
    console.log('remove ', item.name);
    await rm(pathToItem, {
      recursive: true,
      force: true,
      maxRetries: 2,
    });
  });
}

async function createBundle(destination) {
  try {
    await access(destination, constants.R_OK | constants.W_OK);
    console.log('dir exists');
    // await clearDir(destination);
  }
  catch (err) {
    console.log(err);
  }
}

createBundle(destination);
