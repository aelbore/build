const path = require('path');

const { clean } = require('@ngx-devtools/common');

const { copyPackageFile } = require('./copy-package');
const { copyEntryFiles, updateEntryFile } = require('./copy-entry');
const { inlineSources } = require('./inline-sources');
const { compile } = require('./ngc');
const { copyAssetFiles } = require('./copy-assets');
const { getSrcDirectories } = require('./directories');
const { rollupConfigs } = require('./rollup.config');

const { buildDev, buildDevAll, buildDevPackage } = require('./build-dev');

const rollup = require('./rollup');

/**
 * Bundle Source files to Angular Standard Libary
 * @param {source file} src 
 * @param {*} dest 
 */
const bundle = (src, dest) => {
  return copyPackageFile(src, dest)
    .then(pkgName => {
      const destSrc = path.resolve(dest);
      const folderTempBaseDir = path.join(destSrc.replace(path.basename(destSrc), '.tmp'), pkgName);
      return Promise.all([ copyEntryFiles(folderTempBaseDir), inlineSources(src, pkgName) ])
        .then(() => Promise.resolve(folderTempBaseDir)); 
    })
    .then(tmpSrc => updateEntryFile(tmpSrc))
    .then(tmpSrc => compile(tmpSrc))
    .then(tmpSrc => Promise.all([ copyAssetFiles(tmpSrc, dest), rollup(tmpSrc, dest) ]));
};

/**
 * 
 * @param {*} src 
 * @param {*} dest 
 */
const bundlePackage = (src, dest) => {
  const srcFile = path.join(path.dirname(src), '**/*.ts').split(path.sep).join('/');
  const destPath = path.resolve(path.dirname(src).replace('src', dest).replace('libs', ''));
  return clean(destPath).then(() => bundle(srcFile, dest))
};

/**
 * bundle all files/folders
 */
const bundleFiles = () => {
  return getSrcDirectories().then(directories => {
    const folders = directories.map(folder => 
      Object.assign(folder, { src: folder.src.split(path.sep).join('/') + '/**/*.ts' })
    );
    return Promise.all(folders.map(folder => bundle(folder.src, folder.dest)));
  }).catch(error => console.error(error));
};

exports.buildDevPackage = buildDevPackage;
exports.buildDev = buildDev;
exports.buildDevAll = buildDevAll;
exports.bundleFiles = bundleFiles;
exports.bundle = bundle;
exports.bundlePackage = bundlePackage;
exports.copyPackageFile = copyPackageFile;
exports.copyEntryFiles = copyEntryFiles;
exports.inlineSources = inlineSources;
exports.compile = compile;
exports.copyAssetFiles = copyAssetFiles;
exports.getSrcDirectories = getSrcDirectories;
exports.rollupConfigs = rollupConfigs;