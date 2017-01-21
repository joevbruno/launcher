export default function loadFonts({ isDev, isClient }, { publicPath }) {
  return {
    test: /\.(ttf|woff|woff2|ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
    loader: 'file-loader',
    query: {
      name: '[name].[ext]',
      publicPath,
      emitFile: isClient,
    }
  };
}
