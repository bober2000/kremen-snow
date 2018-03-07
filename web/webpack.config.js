// Require
const webpack = require('webpack');
const path = require('path');
// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// Data
const package = require('./package.json');
const appPath = path.resolve(__dirname, 'src/app');
const distPath = path.resolve(__dirname, 'dist');
const assetsPath = path.resolve(__dirname, 'src/assets');

// Exports
module.exports = (env) => ({
  entry: {
    'app': `${appPath}/app.js`
  },
  output: {
    path: distPath,
    filename: '[name].js'
  },
  resolve: {
    alias: {
      components: `${appPath}/components`,
      pages: `${appPath}/pages`,
      services: `${appPath}/services`,
      styles: `${appPath}/styles`,
      utils: `${appPath}/utils`,
      consts: `${appPath}/consts`,
      assets: assetsPath
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      { test: /\.jsx?/, use: 'babel-loader', include: appPath },
      { test: /\.(png|woff|woff2|eot|ttf|svg|gif)/, use: 'url-loader?limit=100000' },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: package.title,
      company: package.company,
      description: package.description,
      url: package.url,
      filename: 'index.html',
      template: 'src/assets/templates/index.ejs',
      hash: true,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true
      }
    }),
    new CopyWebpackPlugin([
      {context: 'src', from: 'assets/img/*.{png,jpg}'},
    ]),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(package.version),
      ENV: JSON.stringify(env),
      MAPS_API_KEY: JSON.stringify(process.env.MAPS_API_KEY),
    })
  ],
  devServer: {
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
});
