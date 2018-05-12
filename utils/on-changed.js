
const { buildAsync } = require('./build-async');
const { watch } = require('./build-config');

const onClientFileChanged = (path) => {
  const file = path.replace('.scss', '.ts').replace('.css', '.ts').replace('.html', '.ts');
  return (path && path.includes('src')) ? buildAsync(file, watch.dest) : Promise.resolve();
};

module.exports = onClientFileChanged;