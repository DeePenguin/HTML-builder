const { readdir, stat } = require('fs/promises');
const path = require('path');

const pathToDir = path.join(__dirname, 'secret-folder');

const getFileInfo = (filename) => {
  return path.parse(filename);
};

const getFileSize = async (filename) => {
  const {size} = await stat(filename);
  return size;
};

(async () => {
  try {
    const directoryContent = await readdir(pathToDir, {withFileTypes: true});
    const files = directoryContent.filter(a => a.isFile());
    files.forEach(async (file) => {
      const pathToFile = path.join(pathToDir, file.name);
      const { name, ext } = getFileInfo(pathToFile);
      const size = await getFileSize(pathToFile);
      const output = `${name} - ${ext.substring(1)} - ${size}b`;
      console.log(output);
    });
  } catch (err) {
    console.error(err);
  }
})();
