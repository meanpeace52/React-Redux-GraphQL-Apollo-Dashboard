var nodeExternals = require('cdm-webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var libPath = require('../../src/webpack-util');

var webpack_opts = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: libPath('index.js'),
    libraryTarget: "commonjs2",
    library: "@adminide-stack/client-react"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js',  '.css'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.tsx?$/,
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
    rules: [
      {
        test: /\.tsx?$/,
        loaders: 'ts-loader'
      },
      {
        test: /\.json?$/,
        loaders: 'json-loader'
       },
      {
        test: /\.css$/,
        loaders: 'css-loader'
      },
    ]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules" }), 
  {"@adminide-stack/client-redux": "@adminide-stack/client-redux"}, 
  {"@adminide-stack/client-core": "@adminide-stack/client-core"}
  ]
};

module.exports = webpack_opts;
