const {readdir, mkdir, copyFile, rm } = require('fs/promises');
const path = require('path');


async function clearFolder(source) {
  const directoryContent = await readdir(source, {withFileTypes: true});
  directoryContent.forEach((item) => {
    const pathToItem = path.join(source, item.name);
    console.log('remove ', pathToItem);
    rm(pathToItem, {
      recursive: true,
      force: true,
      maxRetries: 2,
    });
  });
}

async function copyFolder(source, destination = null) {
  const { name: sourceName, dir: sourcePath } = path.parse(source);
  const destinationPath = destination ?? path.join(sourcePath, `${sourceName}-copy`);

  mkdir(destinationPath, { recursive: true });
  if (!destination) await clearFolder(destinationPath);

  const sourceContent = await readdir(source, {withFileTypes: true});
  sourceContent.forEach((item) => {
    const pathToOriginal = path.join(source, item.name);
    const pathToCopy = path.join(destinationPath, item.name);
    if (item.isDirectory()) {
      return copyFolder(pathToOriginal, pathToCopy);
    } else {
      copyFile(pathToOriginal, pathToCopy);
    }
  });
}

copyFolder(path.join(__dirname, 'files'));
