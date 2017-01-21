import webpack from 'webpack';
import { sendFeedback, handleWebpackFeedback } from './sendFeedback';
import webpackBuilder from './webpackBuilder';

function buildConfiguration(environment, modifyConfiguration) {
  const settings = webpackBuilder(environment);
  const { defaultConfig, entries } = settings;

  return modifyConfiguration(defaultConfig, entries);
}

export default function createWebpackTask(environment, modifyConfiguration, handleResponse, beforeCompileHook, watch) { // eslint-disable-line
  return () => new Promise((resolve, reject) => {
    const config = buildConfiguration(environment, modifyConfiguration);
    const compiler = beforeCompileHook ? webpack(beforeCompileHook(config)) : webpack(config);

    try {
      const handleWebpackOutput = (error, stats) => {
        if (error) {
          console.log(error);
          reject(error);
        }

        if (handleResponse) {
          handleResponse(error, stats);
        } else {
          sendFeedback(handleWebpackFeedback(stats), { webpack: stats });
        }

        if (!stats) {
          reject('Oops, no stats! Something went wrong!');
        }

        resolve(stats.toJson());
      };

      if (watch) {
        compiler.watch({
          aggregateTimeout: 300, // wait so long for more changes
          poll: false // use polling instead of native watchers
        }, handleWebpackOutput);
      } else {
        compiler.run(handleWebpackOutput);
      }
    } catch (e) {
      sendFeedback(e);
    }
  });
}
