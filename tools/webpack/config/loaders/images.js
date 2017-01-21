export default function loadImages() {
  return {
    test: /\.(png|jpg|jpeg|gif|svg|mp4|webm|wav|mp3|m4a|aac|oga)$/,
    loader: 'url-loader',
    query: {
      name: 'static/media/[name].[hash:8].[ext]',
      limit: 10000
    }
  };
}
