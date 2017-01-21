import webpackBuilder from '../../utils/webpackBuilder';

const environmentOptions = {
  isHot: true,
  debug: true,
  turbo: true,
  inMemory: true
};

export default function generateHotReloadConfiguration() {
  const config = webpackBuilder(environmentOptions);
  const { defaultConfig, entries, paths } = config;
  const { vendorsFromPackageJSON, globalCSS, polyfills } = entries;
  const webpackConfig = { ...defaultConfig };
  const { serverIp, port } = paths;

  const hotMiddleware = [
    'react-hot-loader/patch',
    'eventsource-polyfill',
    `webpack-hot-middleware/client?path=http://${serverIp}:${port}/__webpack_hmr`,
  ];

  webpackConfig.devtool = 'eval';

  webpackConfig.entry = {
    vendors: [
      ...hotMiddleware,
      polyfills,
      ...vendorsFromPackageJSON,
      ...globalCSS,
    ],
    main: [paths.bundles.client.entry]
  };
  return webpackConfig;
}
