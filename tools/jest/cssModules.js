var babelJest = require('babel-jest');

module.exports = {
  process: function(src, filename) {
    if (filename.indexOf('node_modules') === -1 && filename.match(/\.jsx?$/)) {
      src = babelJest.process(src, filename);
    } else {
      src = '';
    }
    return src;
  }
};
