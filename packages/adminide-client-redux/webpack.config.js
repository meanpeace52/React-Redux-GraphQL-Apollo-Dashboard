var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeExternals = require('cdm-webpack-node-externals');
var libPath = require('../../src/webpack-util');

var webpack_opts = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: libPath('index.js'),
    library: '@adminide-stack/client-redux',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'src',
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.ts$/,
        ts: {
          compiler: 'typescript',
          configFileName: 'tsconfig.json'
        },
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    })
  ],
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader'
    }]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules" }),
  { "@adminide-stack/client-core": "@adminide-stack/client-core" }]
};

module.exports = webpack_opts;