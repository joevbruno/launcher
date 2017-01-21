import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import webpackIsomorphicAssets from '../assets';

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicAssets);

export const getBanner = ({ isNode }) =>
  isNode ? new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false }) : null;

export const getAnalyzer = ({ debug, analyze }) =>
  (debug && analyze ? new BundleAnalyzerPlugin() : null);

// export const getDLLReference = (env, { dllManifest }) =>
//  new webpack.DllReferencePlugin({ context: '.', manifest: require(dllManifest) });

export const getHotReloadingPlugin = () => new webpack.HotModuleReplacementPlugin();

// export const getIsomorphicPlugin = () => webpackIsomorphicToolsPlugin.development();
