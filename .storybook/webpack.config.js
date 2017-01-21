const path = require('path');

module.exports = {
  resolve: {
    alias: {
        utilities: path.resolve(__dirname, '../src/utilities/index.js')
    },
  },
  module: {
    loaders: [
      {
        test: /.scss$/,
        exclude: 'storybook-readme',
        loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
      },
      {
      test: /\.md$/,
      loader: "raw"
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }]
  },
  externals: {
   'jsdom': 'window',
   'cheerio': 'window',
   'react/lib/ExecutionEnvironment': true,
   'react/lib/ReactContext': 'window',
   'react/addons': true,
 }
};
