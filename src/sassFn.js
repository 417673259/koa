const sass = require('node-sass');

module.exports = (data, filename) => {
  console.log('prepa');
  const result = sass.renderSync({
    data,
    file: filename,
  }).css;
  return result.toString('utf8');
};
