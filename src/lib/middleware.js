import webpackDevMiddleWare from 'koa-webpack-dev-middleware';
import webpackHotMiddleWare from 'koa-webpack-hot-middleware';
import webpack from 'webpack';
import webpackConfig from '../webpack/client';

webpackConfig.entry.app.unshift('webpack-hot-middleware/client?noInfo=true&reload=true');
const compiler = webpack(webpackConfig);

export default function middleware(app) {
  app.use(webpackDevMiddleWare(compiler, {
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(webpackHotMiddleWare(compiler));
}
