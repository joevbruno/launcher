import webpackBuilder from '../../utils/webpackBuilder';

const environmentOptions = {
  isHot: false,
  debug: true,
  turbo: false,
  inMemory: false,
  target: 'server'
};

export default function generateServerConfiguration() {
  const config = webpackBuilder(environmentOptions);
  const { defaultConfig, paths } = config;
  const webpackConfig = { ...defaultConfig };

  webpackConfig.entry = {
    main: [paths.bundles.server.entry]
  };
  return webpackConfig;
}
