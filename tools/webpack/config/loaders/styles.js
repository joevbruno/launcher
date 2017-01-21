import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';

const loadStyles = (environment) => {
  const { turbo, debug, isNode } = environment;
  const scssConfig = turbo
      ? 'sass-loader?outputStyle=expanded!'
      : 'sass-loader?sourceMap&outputStyle=expanded!';

  const supportedBrowsers = [
    '>1%',
    'last 4 versions',
    'Firefox ESR',
    'not ie < 9'
  ];

  const loaders = [
    `css-loader?${JSON.stringify({
      importLoaders: 1,
      sourceMap: debug,
      localIdentName: '[name]-[local]-[hash:base64:5]',
      minimize: !debug,
      discardComments: { removeAll: true },
    })}`,
    'postcss-loader?pack=default',
    scssConfig
  ];

  const cssExtractLoader = ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: 'css-loader?modules&localIdentName=[local]--[hash:base64:5]!postcss-loader!sass-loader',
  });

  const configs = {
    postcss: [ // other postcss plugin can be listed here
      autoprefixer({ browsers: supportedBrowsers })
    ],
  };

  return {
    loader: {
      test: /\.(scss|css)$/,
      loader: isNode ? 'css-loader/locals' : cssExtractLoader
    },
    configs
  };
};

export default loadStyles;
