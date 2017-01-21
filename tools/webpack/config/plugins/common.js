import webpack from 'webpack';
import WebpackNotifierPlugin from 'webpack-notifier';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import CodeSplitPlugin from 'code-split-component/webpack';
import { resolveApp } from '../helpers';

export const getCaseSensitivePaths = () => new CaseSensitivePathsPlugin();
export const getNoErrors = () => new webpack.NoErrorsPlugin();
export const getCodeSplitting = ({ isDebug, isServer }) => new CodeSplitPlugin({ disabled: false }); // isDebug && !isServer
export const getNotifier = () => new WebpackNotifierPlugin();
// export const getDotEnvironment = (env, { dotEnvPath }) => new Dotenv({ dotEnvPath, safe: false });

export const getWatchingMissingModules = (env, { nodeModulesPath }) =>
  new WatchMissingNodeModulesPlugin(nodeModulesPath);

export const getCommonChunks = ({ isNode }, { output }) =>
  (!isNode ? new webpack.optimize.CommonsChunkPlugin("common") : null);

export const getLoaderOptions = (env, paths, loaderConfigs) =>
  new webpack.LoaderOptionsPlugin({ options: { context: resolveApp(''), ...loaderConfigs }, minimize: env.debug });

export const getExtractTextPlugin = ({ debug }, { cssFileName }) =>
  new ExtractTextPlugin({ filename: cssFileName, allChunks: true, disable: debug });

export const getAssetsPlugin = ({ isClient }) =>
  new AssetsPlugin({ path: resolveApp('public'), filename: isClient ? 'client-assets.js' : 'server-assets.js', processOutput: x => `module.exports = ${JSON.stringify(x)};` });

export const getDefinitionPlugin = ({ mode, isClient, isServer, isNode }) => new webpack.DefinePlugin({ // eslint-disable-line max-len
  'process.env.NODE_ENV': JSON.stringify(mode),
  'process.env.BABEL_ENV': JSON.stringify(mode),
  'process.env.IS_CLIENT': JSON.stringify(isClient),
  'process.env.IS_SERVER': JSON.stringify(isServer),
  'process.env.IS_NODE': JSON.stringify(isNode),
});

/* export const getHtmlPlugin = (env, { templatePath }) =>
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: templatePath,
    inject: 'body',
  }); */
