import dbInstance from '../instance/author';

const Router = require('koa-router');

const router = new Router();

router.get('/*', async (ctx) => {
  try {
    const { request: { path, query } } = ctx;
    const reg = /^\/api\/(.+)$/;
    if (reg.test(path)) {
      const fn = reg.exec(path)[1];
      const list = await dbInstance[fn](query);
      ctx.body = {
        code: 200,
        data: list,
      };
    } else {
      ctx.body = {
        code: 404,
      };
    }
  } catch (err) {
    ctx.app.emit('error', err, ctx);
  }
});

exports.authorRouter = router;
