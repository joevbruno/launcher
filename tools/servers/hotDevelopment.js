/* @flow */
/* eslint-disable no-console */
import webpack from 'webpack';
import HotNodeServer from './hotNodeServer';
import HotClientServer from './hotClientServer';
import createVendorDLL from '../webpack/tasks/vendors/config';
import webpackDevClientConfig from '../webpack/tasks/hotReloadClient/config';
import webpackDevServerConfig from '../webpack/tasks/serverDevelopment/config';
import { log } from './log';

const vendorDLLsFailed = (err) => {
  log({
    title: 'vendorDLL',
    level: 'error',
    message: 'Unfortunately an error occured whilst trying to build the vendor dll(s) used by the development server. Please check the console for more information.',
    notify: true,
  });
  if (err) {
    console.error(err);
  }
};

const initializeBundle = (name) => {
  const config = name === 'client' ? webpackDevClientConfig() : webpackDevServerConfig();
  const createCompiler = () => {
    try {
      const webpackConfig = config;
      return webpack(webpackConfig);
    } catch (err) {
      log({
        title: 'development',
        level: 'error',
        message: 'Webpack config is invalid, please check the console for more information.',
        notify: true,
      });
      console.error(err);
      throw err;
    }
  };
  return { name, bundleConfig: config, createCompiler };
};

class HotDevelopment {
  hotNodeServers: Array<HotNodeServer>;
  hotClientServer: ?HotClientServer;

  constructor() {
    this.hotClientServer = null;
    this.hotNodeServers = [];

    const clientBundle = initializeBundle('client');

    const nodeBundles = [initializeBundle('server')];

    Promise
      .resolve()// () => createVendorDLL()
      .then(
        () => new Promise((resolve) => {
          const { createCompiler } = clientBundle;
          const compiler = createCompiler();
          compiler.plugin('done', (stats) => {
            if (!stats.hasErrors()) {
              resolve(compiler);
            }
          });
          this.hotClientServer = new HotClientServer(compiler);
        }),
        (error) => console.log(error, "error"),
      )
      // Then start the node development server(s).
      .then((clientCompiler) => {
        this.hotNodeServers = nodeBundles
          .map(({ name, createCompiler }) =>
            // $FlowFixMe
            new HotNodeServer(name, createCompiler(), clientCompiler),
          );
      }).catch(error => console.log(error));
  }

  dispose() {
    const safeDisposer = server =>
      (server ? server.dispose() : Promise.resolve());

    // First the hot client server.
    return safeDisposer(this.hotClientServer)
      // Then dispose the hot node server(s).
      .then(() => Promise.all(this.hotNodeServers.map(safeDisposer)));
  }
}

export default HotDevelopment;
