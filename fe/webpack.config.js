const path = require('path');

module.exports = {
	entry: '/app/src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
  devServer: {
    contentBase: '/app/dist',
    hot: true,
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ]
  },
};
