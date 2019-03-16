import Koa from 'koa';
import views from 'koa-views';
import path from 'path';
import favicon from 'koa-favicon';
import middleware from '../lib/middleware';
import setContextState from '../lib/help';

const app = new Koa();
const { router } = require('./router');

const env = process.env.NODE_ENV;

setContextState(app);
if (env === 'development') {
  middleware(app);
}

app.use(views(path.resolve(__dirname, './views'), {
  extension: 'html',
  map: {
    html: 'ejs',
  },
}));
app.use(favicon(path.resolve('/src/serve/favicon.ico')));
app.use(router.routes());
app.on('error', (err) => {
  console.error(err);
});
app.listen(4000);
