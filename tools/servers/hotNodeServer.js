/* @flow */
/* eslint-disable no-console */

import path from 'path';
import appRootDir from 'app-root-dir';
import { spawn } from 'child_process';
import { log } from './log';

class HotNodeServer {
  watcher: any;
  disposing: boolean;
  server: ?Object;
  serverCompiling: boolean;
  clientCompiling: boolean;

  constructor(name: string, compiler: Object, clientCompiler: Object) {
    this.hasInitialDoneCompleted = false;
    this.canCompileAtWill = false;

    const compiledEntryFile = path.resolve(
      appRootDir.get(),
      compiler.options.output.path,
      `${Object.keys(compiler.options.entry)[0]}.js`,
    );

    const startServer = () => {
      if (this.server) {
        this.server.kill();
        this.server = null;
        log({
          title: name,
          level: 'info',
          message: 'Restarting server...',
        });
      }

      const newServer = spawn('node', [compiledEntryFile]);

      log({
        title: name,
        level: 'info',
        message: 'Server running with latest changes.',
        notify: true,
      });

      newServer.stdout.on('data', data => {

        console.log(data.toString().trim())
      });
      newServer.stderr.on('data', (data) => {
        log({
          title: name,
          level: 'error',
          message: 'Error in server execution, check the console for more info.',
        });
        console.error(data.toString().trim());
      });
      this.server = newServer;
    };

    // We want our node server bundles to only start after a successful client
    // build.  This avoids any issues with node server bundles depending on
    // client bundle assets.
    const waitForClientThenStartServer = () => {
      if (this.serverCompiling || (this.hasInitialDoneCompleted && !this.canCompileAtWill)) {
        // A new server bundle is building, break this loop.
        return;
      }
      if (this.clientCompiling) {
        setTimeout(waitForClientThenStartServer, 50);
      } else {
        startServer();
      }
    };

    clientCompiler.plugin('compile', () => {
      this.clientCompiling = true;
    });

    clientCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors()) {
        this.clientCompiling = false;
      }
    });

    compiler.plugin('compile', () => {
      this.serverCompiling = true;
      /* log({
        title: name,
        level: 'info',
        message: 'Building new bundle...',
      });*/
    });

    compiler.plugin('done', (stats) => {
      this.serverCompiling = false;

      if (this.disposing) {
        return;
      }

      try {
        if (stats.hasErrors()) {
          log({
            title: name,
            level: 'error',
            message: 'Build failed, check the console for more information.',
            notify: true,
          });
          console.log(stats.toString());
          return;
        }

        waitForClientThenStartServer();
      } catch (err) {
        log({
          title: name,
          level: 'error',
          message: 'Failed to start, please check the console for more information.',
          notify: true,
        });
        console.error(err);
      }
      this.hasInitialDoneCompleted = true;
      setTimeout(() => this.canCompileAtWill = true, 20000)
    });

    // Lets start the compiler.
    this.watcher = compiler.watch(null, () => undefined);
  }

  dispose() {
    this.disposing = true;

    const stopWatcher = new Promise((resolve) => {
      this.watcher.close(resolve);
    });

    return stopWatcher.then(() => { if (this.server) this.server.kill(); });
  }
}

export default HotNodeServer;
