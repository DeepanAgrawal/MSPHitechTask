/* eslint-disable */
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var APP_DIR = path.resolve(__dirname, './app');
var DEV_BUILD = path.resolve(__dirname, '.');


function getPlugIn() {
  return [
    new webpack.ProvidePlugin({
      Promise: 'bluebird'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve("./index.html"),
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(process.env.NODE_ENV.trim())
    })
  ]
}


var config = {
  mode : 'development',
  entry: {
    app: APP_DIR + '/main.js'
  },
  output: {
    path: DEV_BUILD,
    filename: 'index.js'
  },
  devServer: {
    inline: true,
    port: 3010
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?/,
        include: APP_DIR,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: ['es2015', 'react', "stage-2"]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader?sourceMap']
      },
      {
        test: /\.(svg|jpg|png|gif)$/,
        use: 'file-loader?sourceMap'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100
          }
        }
      }
    ]
  },
  plugins: getPlugIn(),
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      app_assets: __dirname + '/app/assets',
      container_source: __dirname + '/app/containers',
      reducer_source: __dirname + '/app/reducers',
      app_actions: __dirname + '/app/actions',
      app_components: __dirname + "/app/components",
      rootSource: __dirname + '/app',
      utils_source: __dirname + "/app/utils"
    }
  },
  devtool: '#inline-source-map'
};
module.exports = config;
