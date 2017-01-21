import nodeExternals from 'webpack-node-externals';

const nodeBundlesIncludeNodeModuleFileTypes = [
  /\.(eot|woff|woff2|ttf|otf)$/,
  /\.(svg|png|jpg|jpeg|gif|ico)$/,
  /\.(mp4|mp3|ogg|swf|webp)$/,
  /\.(css|scss|sass|sss|less)$/,
];

export default function getSettings(environment) {
  const { turbo, debug, isClient, isNode } = environment;
  const devtoolSourceMaps = turbo ? 'cheap-module-eval-source-map' : 'source-map';
  const externals = isNode ? nodeExternals({ whitelist: nodeBundlesIncludeNodeModuleFileTypes }) : {}; // eslint-disable-line max-len
  const cache = true;
  const resolveExt = ['.js', '.jsx', '.scss', '.css', '.webpack.js', '.web.js', '.json', '.node'];
  const unsafeCache = true;
  const target = isClient ? 'web' : 'node';

  return {
    devtoolSourceMaps,
    externals,
    target,
    debug,
    cache,
    resolveExt,
    unsafeCache
  };
}
