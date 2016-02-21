'use strict';

var path = require('path');
var webpack = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');

// must match config.webpack.dev_server.port
var devServerPort = 3808;

// set TARGET=production on the environment to add asset fingerprints
var production = process.env.TARGET === 'production';

var config = {
  entry: {
    'application': path.join(__dirname, '..', 'app/assets/javascripts/application.js'),
    'second': path.join(__dirname, '..', 'app/assets/javascripts/second.js')
  },

  output: {
    // Build assets directly in to public/dist/, let webpack know
    // that all webpacked assets start with dist/

    // must match config.webpack.output_dir
    path: path.join(__dirname, '..', 'public', 'dist'),
    publicPath: '/dist/',

    filename: production ? '[name]-[chunkhash].js' : '[name].js'
  },

  resolve: {
    root: path.join(__dirname, '..', 'app/assets/javascripts'),
    modulesDirectories: [
      path.join(__dirname, '..', 'node_modules'),
      path.join(__dirname, '..', 'app/assets/stylesheets')
    ],
    extensions: ['', '.js']
  },

  sassLoader: {
    includePaths: [path.join(__dirname, '..', 'node_modules')]
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test   : /\.scss$/,
        loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
      },
      {
        test: /\.png$/,
        loader: "url-loader?mimetype=image/png"
      }
    ]
  },

  plugins: [
    // must match config.webpack.manifest_filename
    new StatsPlugin('manifest.json', {
      // We only need assetsByChunkName
      chunkModules: false,
      source: false,
      chunks: false,
      modules: false,
      assets: true
    })]
};

if (production) {
  config.plugins.push(
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: { warnings: false },
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  );
} else {
  config.devServer = {
    port: devServerPort,
    headers: { 'Access-Control-Allow-Origin': '*' }
  };
  config.output.publicPath = '//localhost:' + devServerPort + '/dist/';
  // Source maps
  config.devtool = 'cheap-module-eval-source-map';
}

module.exports = config;
