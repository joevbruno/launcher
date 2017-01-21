/* eslint-disable no-process-env */
import ip from 'ip';
import { resolveApp, ensureSlash } from './helpers';

export const getStaticPaths = () => {
  const outputFolder = 'build';
  const clientSrcFolder = 'client';
  const serverSrcFolder = 'server';
  const homepagePathname = '/';
  const publicUrl = ensureSlash(homepagePathname, false);
  const context = resolveApp('');
  const hotUpdateMainFilename = 'hot/[hash].hot-update.json';
  const hotUpdateChunkFilename = 'hot/[id].[hash].hot-update.js';

  const appRoot = resolveApp('');
  const appBuild = resolveApp(outputFolder);
  const appHtml = resolveApp(`${outputFolder}/index.html`);
  const appPackageJson = resolveApp('package.json');
  const testsSetup = resolveApp('tools/tests/setup.js');
  const nodeModules = resolveApp('node_modules');

  const dllManifest = resolveApp('dist/vendors-manifest.json');
  const developmentOnlyVendors = [];
  const vendorsFromPackageJSON = [];

  const webpackDevClient = require.resolve('react-dev-utils/webpackHotDevClient');
  const polyfills = require.resolve('./polyfills');
  const regenerate = require('regenerator-runtime/runtime');
  const globalCSS = [resolveApp('common/styles/global.scss')];

  const clientEntry = resolveApp(`${clientSrcFolder}/main.js`);
  const clientIncludes = [resolveApp('client'), resolveApp('common')];
  const clientOutput = resolveApp(`${appBuild}/client`);

  const serverEntry = resolveApp(`${serverSrcFolder}/main.js`);
  const serverIncludes = [resolveApp('server'), resolveApp('common')];
  const serverOutput = resolveApp(`${appBuild}/server`);

  return {
    appRoot,
    appPackageJson,
    appHtml,
    testsSetup,
    publicUrl,
    context,
    nodeModules,
    dllManifest,
    hotUpdateMainFilename,
    hotUpdateChunkFilename,
    entries: {
      regenerate,
      polyfills,
      vendorsFromPackageJSON,
      globalCSS,
      webpackDevClient,
      developmentOnlyVendors
    },
    bundles: {
      client: {
        entry: clientEntry,
        includes: clientIncludes,
        output: clientOutput,
      },
      server: {
        entry: serverEntry,
        includes: serverIncludes,
        output: serverOutput
      }
    }
  };
};


export const getDynamicPaths = (environment) => {
  const { debug, port, inMemory, remoteHotReload, isServer } = environment;
  const serverIp = remoteHotReload
    ? ip.address() // Dynamic IP address enables hot reload on remote devices.
    : 'localhost';

  const cssFileName = !debug ? 'css/[name].[contenthash:8].min.css' : 'css/[name].css';
  let jsFilename = !debug ? 'js/[name].[chunkhash:8].min.js' : 'js/[name].js';

  if (isServer) {
    jsFilename = '[name].js';
  }
  const commonChunksFilename = !debug ? 'static/js/[name].[chunkhash:8].chunk.min.js' : '[name].chunk.js';

  const clientWebPath = '/client/';
  const publicPath = debug && inMemory ? `http://${serverIp}:${port}${clientWebPath}` : clientWebPath;
  const dotEnvPath = resolveApp('tools/dotenv/development/.env-client');

  return {
    serverIp,
    dotEnvPath,
    port,
    cssFileName,
    jsFilename,
    commonChunksFilename,
    publicPath
  };
};

const getPaths = (environment) => {
  const { isNode, target } = environment;
  const { hotUpdateMainFilename, hotUpdateChunkFilename, bundles, ...statics } = getStaticPaths(); // eslint-disable-line max-len
  const { jsFilename, commonChunksFilename, publicPath, ...dynamic } = getDynamicPaths(environment);

  return {
    ...statics,
    ...dynamic,
    bundles,
    output: {
      filename: jsFilename,
      path: bundles[target].output,
      chunkFilename: commonChunksFilename,
      publicPath,
      pathinfo: true,
      hotUpdateMainFilename,
      hotUpdateChunkFilename,
      libraryTarget: isNode ? ('commonjs2', 'var') : undefined,
    }
  };
};

export default getPaths;
