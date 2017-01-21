import * as common from './common';
import * as production from './production';
import * as development from './development';

const getPlugins = (env, paths, loaderConfigs) => {
  const { debug } = env;
  const cb = p => p(env, paths, loaderConfigs);

  if (debug) {
    const x = [...Object.values(common).map(cb), ...Object.values(development).map(cb)].filter(x => x);
    return x;
  }

  return [...Object.values(common).map(cb), ...Object.values(production).map(cb)].filter(x => x);
};

export default getPlugins;
