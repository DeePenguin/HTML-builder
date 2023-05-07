const { readdir, rm, mkdir, readFile, access, constants } = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const {join, parse} = require('path');
const { pipeline } = require('stream/promises');
const { Transform } = require('stream');

const destination = join(__dirname, 'project-dist');
const cssExt = '.css';
const htmlExt = '.html';

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

async function createDir(destination) {
  const dirExists = await isExist(destination);
  if (dirExists) await rm(destination, {recursive: true});
  await mkdir(destination);
}

function filterDirEntByExtension(source, dirEnt, ext) {
  const pathToFile = join(source, dirEnt.name);
  return dirEnt.isFile() && parse(pathToFile).ext === ext;
}

async function createCssBundle(source, destination) {
  const directoryContent = await readdir(source, {withFileTypes: true});
  const cssFiles = directoryContent.
    filter((item) => filterDirEntByExtension(source, item, cssExt)).
    map((item) => join(source, item.name));

  cssFiles.forEach(async (pathTofile) => {
    const rs = createReadStream(pathTofile);
    const ws = createWriteStream(destination, {flags: 'a'});
    await pipeline(rs, ws);
  });
}

async function copyDir(source, destination) {
  await createDir(destination);
  const sourceContent = await readdir(source, {withFileTypes: true});
  sourceContent.forEach(async (item) => {
    const pathToOriginal = join(source, item.name);
    const pathToCopy = join(destination, item.name);
    if (item.isDirectory()) return await copyDir(pathToOriginal, pathToCopy);
    await pipeline(
      createReadStream(pathToOriginal),
      createWriteStream(pathToCopy)
    );
  });
}

async function createHtml(source, destination, templatesSource) {
  const templateRegexp = /(?<template>{{(?<name>\w+)}})/gm;
  const templatesDirContent = await readdir(templatesSource, {withFileTypes: true});
  const templates = templatesDirContent.
    filter((item) => filterDirEntByExtension(templatesSource, item, htmlExt)).
    reduce((acc, item) => {
      const name = parse(item.name).name;
      acc[name] = join(templatesSource, item.name);
      return acc;
    }, {});
  const rs = createReadStream(source);
  const ws = createWriteStream(destination);
  const ts = new Transform({
    async transform(chunk, _, cb) {
      let result = chunk.toString();
      const matches = result.matchAll(templateRegexp);
      for (const match of matches) {
        const {name: templateName, template} = match.groups;
        const replacement = await readFile(templates[templateName]);
        result = result.replace(template, replacement);
      }
      this.push(result);
      cb();
    }
  });
  await pipeline( rs, ts, ws);
}



async function createBundle(destination) {
  const cssDestination = join(destination, 'style.css');
  const cssSource = join(__dirname, 'styles');
  const assetsDestination = join(destination, 'assets');
  const assetsSource = join(__dirname, 'assets');
  const htmlSource = join(__dirname, 'template.html');
  const htmlDestination = join(destination, 'index.html');
  const htmlComponentsSource = join(__dirname, 'components');
  try {
    await createDir(destination);
    await copyDir(assetsSource, assetsDestination);
    await createCssBundle(cssSource, cssDestination);
    await createHtml(htmlSource, htmlDestination, htmlComponentsSource);
  }
  catch (err) {
    console.log(err.message);
  }
}

createBundle(destination);
