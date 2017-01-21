import webpackBuilder from '../../utils/webpackBuilder';
import createWebpackTask from '../../utils/createWebpackTask';

const environmentOptions = {
  isHot: false,
  debug: false,
  turbo: false,
  inMemory: false
};

export default createWebpackTask(environmentOptions, (config, entries) => {
  function generateProductionConfiguration(target = 'client') {
    const settings = webpackBuilder(environmentOptions);
    const { defaultConfig, entries, paths } = settings;
    const { vendorsFromPackageJSON, globalCSS, polyfills } = entries;
    const webpackConfig = { ...defaultConfig };
    const { bundles } = paths;
    const entry = bundles[target].entry;

    webpackConfig.bail = true;
    webpackConfig.entry = {
      main: [...vendorsFromPackageJSON, polyfills, entry]
    };

    return webpackConfig;
  }

  return generateProductionConfiguration();
});
