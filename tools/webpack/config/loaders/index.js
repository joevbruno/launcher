import loadScripts from './scripts';
import loadFonts from './fonts';
import loadJSON from './json';
import loadStyles from './styles';
import loadImages from './images';
import loadHTML from './html';

export default function getLoaders(environment, paths) {
  const css = loadStyles(environment, paths);

  return {
    css,
    images: loadImages(environment, paths),
    fonts: loadFonts(environment, paths),
    js: loadScripts(environment, paths),
    json: loadJSON(),
    html: loadHTML(),
    configs: {
      ...css.configs
    }
  };
}
