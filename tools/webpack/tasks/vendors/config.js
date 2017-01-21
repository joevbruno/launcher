import webpack from 'webpack';
import path from 'path';
import createWebpackTask from '../../utils/createWebpackTask';
import { sendFeedback, buildStartMessage } from '../../utils/SendFeedback';

export default createWebpackTask({ debug: true, inMemory: true }, (config, entries) => {
  sendFeedback(buildStartMessage('Vendors DLL', 10, ' This should be used for development only.'
  + ' In addition to the listed assets that will appear below, a manifest.json file should be created.'
  + ' The manifest.json file provides the actual delegated(dll) references for build caching.'));

  const webpackConfig = config;
  const { developmentOnlyVendors, vendorsFromPackageJSON } = entries;

  webpackConfig.entry = {
    vendors: [...vendorsFromPackageJSON, ...developmentOnlyVendors]
  };
  webpackConfig.output.library = '[name]_lib';
  webpackConfig.plugins = [
    new webpack.DllPlugin({
      path: path.join('dist/[name]-manifest.json'),
      name: '[name]_lib'
    }),
    ...webpackConfig.plugins
  ];

  return webpackConfig;
});
