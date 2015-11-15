var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './client/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  loaders: [
    {
      loader: "babel-loader",
      test: /\.jsx?$/,
      include: [
        path.join(__dirname, 'client')
      ],
      exclude: [
        path.resolve(__dirname, "node_modules")
      ]
    }
      // {
      //   test: /\.less$/,
      //   loader: "style!css!autoprefixer!less"
      // },
  ]
};
