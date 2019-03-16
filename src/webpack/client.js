const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCss = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const env = process.env.NODE_ENV;

const config = {
  entry: {
    app: [
      path.resolve(__dirname, '../client/style/reset.css'),
      path.resolve(__dirname, '../client/style/comm.css'),
      '@babel/polyfill',
      path.resolve(__dirname, '../client/app'),
    ],

  },
  output: {
    filename: env === 'development' ? 'app.js' : 'app-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: env === 'development' ? 'http://m.fangdd.me:4000/assets/' : 'https://static.jjsing.com/assets/',
  },
  mode: env,
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /.scss$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../client/'),
        use: [
          env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]--[hash:base64:5]',
              minimize: false,
              camelCase: true,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /.css$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../client/style/'),
        use: [
          env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /.(jpg)|(png)|(jpeg)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
if (env !== 'development') {
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
      chunkFilename: '[id].css',
    }),
    new OptimizeCss(),
    new ManifestPlugin(),
  );
  config.optimization = {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
    },
  };
}
module.exports = config;
