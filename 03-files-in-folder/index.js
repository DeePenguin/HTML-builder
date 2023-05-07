const { readdir, stat } = require('fs/promises');
const {join, parse} = require('path');

const pathToDir = join(__dirname, 'secret-folder');

const getFileInfo = (pathToFile) => {
  return parse(pathToFile);
};

const getFileSize = async (pathToFile) => {
  const {size} = await stat(pathToFile);
  return size;
};

(async () => {
  try {
    const directoryContent = await readdir(pathToDir, {withFileTypes: true});
    const files = directoryContent.filter(a => a.isFile());
    files.forEach(async (file) => {
      const pathToFile = join(pathToDir, file.name);
      const { name, ext } = getFileInfo(pathToFile);
      const size = await getFileSize(pathToFile);
      const output = `${name} - ${ext.substring(1)} - ${size}b`;
      console.log(output);
    });
  } catch (err) {
    console.error(err);
  }
})();
