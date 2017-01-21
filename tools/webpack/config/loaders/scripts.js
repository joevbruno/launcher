import path from 'path';
import fs from 'fs';

const babelrcConfig = fs.readFileSync(path.resolve(process.cwd(), '.babelrc'), { encoding: 'utf-8' });

export default function loadScripts({ isClient, target, isDebug }) {
  const babelrc = {
    ...JSON.parse(babelrcConfig), // use the babelrc file as a starter
    babelrc: false,
  };

  babelrc.presets[0] = isClient ? ['latest', { es2015: { modules: false } }] : ['env', { targets: { node: true }, modules: false }];
  babelrc.env.production.plugins.push([
    'code-split-component/babel',
    {
      mode: target,
      disabled: false // isDebug
    }
  ]);

  return { // babel config is in package.json
    test: /\.jsx?$/,
    exclude: [/node_modules/, /joi-browser/],
    loader: `babel-loader?${JSON.stringify(babelrc)}`
  };
}
