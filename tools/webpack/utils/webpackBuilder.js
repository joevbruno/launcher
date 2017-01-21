import config from '../config';

export default function webpackBuilder(options) {
  const { getEnvironment, getFilesAndPaths, getSettings, getPlugins, getLoaders } = config;
  const env = getEnvironment(options);

  // files
  const files = getFilesAndPaths(env);
  const { entries, context, output, appRoot, nodeModules } = files;

  // settings
  const settings = getSettings(env);
  const { devtoolSourceMaps, target, externals, cache, resolveExt, unsafeCache } = settings;
  const loaders = getLoaders(env, files);
  const plugins = getPlugins(env, files, loaders.configs);
  const EMPTY = 'empty';

  return {
    defaultConfig: {
      context,
      node: env.isNode ? {
        __dirname: true,
        __filename: true
      } : {
        net: EMPTY,
        tls: EMPTY,
        dns: EMPTY,
        fs: EMPTY,
        crypto: EMPTY,
        __dirname: true,
        __filename: true
      },
      stats: {
        children: false,
        assets: false,
        modules: false,
        cached: true,
        colors: true,
        timings: true,
        reasons: true,
        chunks: false
      },
      performance: {
        hints: false
      },
      output,
      module: {
        loaders: [
          loaders.css.loader,
          loaders.fonts,
          loaders.json,
          loaders.js,
          loaders.html
        ]
      },
      resolve: {
        modules: [
          nodeModules,
          appRoot
        ],
        unsafeCache,
        extensions: resolveExt
      },
      externals,
      target,
      cache,
      devtool: devtoolSourceMaps,
      plugins,
    },
    entries,
    settings,
    env,
    paths: files
  };
}
