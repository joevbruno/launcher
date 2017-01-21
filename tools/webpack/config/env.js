/* eslint-disable no-process-env, no-param-reassign */
// the majority of env keys are handled via the dotenv plugin

const REACT_APP = /^REACT_APP_/i;
const PRODUCTION = 'production';
const DEVELOPMENT = 'development';

const defaultEnvironment = {
  debug: false,
  platform: 'web',
  target: 'client',
  remoteHotReload: false,
  analyze: false,
  isHot: false,
  inMemory: false,
  turbo: false,
  port: process.env.PORT || 3000
};

const getClientEnvironment = () => Object.keys(process.env)
  .filter(key => REACT_APP.test(key))
  .reduce((env, key) => (env[`process.env.${key}`] = JSON.stringify(process.env[key])), {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || DEVELOPMENT
    ),
  });

const setNodeEnvironment = (noGlobals, env) => {
  if (noGlobals !== true) {
    if (env.DEBUG === false) {
      process.env.NODE_ENV = PRODUCTION;
      process.env.BABEL_ENV = PRODUCTION;
    } else {
      process.env.NODE_ENV = DEVELOPMENT;
      process.env.BABEL_ENV = DEVELOPMENT;
    }
  }
};

const getEnvironment = (options, noGlobals) => {
  const env = { ...defaultEnvironment, ...options };

  setNodeEnvironment(noGlobals, env);
  env.clientEnvironment = getClientEnvironment();
  const { debug, target } = env;
  const mode = debug ? DEVELOPMENT : PRODUCTION;

  const isDev = debug;
  const isProd = !debug;
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isNode = !isClient; // Any bundle but the client bundle must target node.

  if (isClient) {
    env.port = 5000;
  }

  return {
    ...env,
    mode,
    isDev,
    isProd,
    isClient,
    isServer,
    isNode
  };
};

export default getEnvironment;
