import webpack from 'webpack';
import OfflinePlugin from 'offline-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';


// export const getAggressiveMerging = () => new webpack.optimize.AggressiveMergingPlugin();
// export const getLimitChunks = () => new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 });
export const getMd5Hash = ({ isClient }) => (isClient ? new WebpackMd5Hash() : null);
// export const getOffline = ({ isClient }) => isClient ? new OfflinePlugin({ AppCache: { FALLBACK: { '/': '/index.html' } } }) : null;
export const getUglify = () => new webpack.optimize.UglifyJsPlugin({
  sourceMap: true,
  compress: {
    screw_ie8: true,
    warnings: false,
    drop_debugger: true
  },
  mangle: {
    screw_ie8: true
  },
  output: {
    comments: false,
    screw_ie8: true
  }
});
