import { fetchData, getComponent } from '../../lib/ssr';


const Router = require('koa-router');

const router = new Router();

const { authorRouter } = require('./author');

router.use('/api', authorRouter.routes());

router.get('*', getComponent);
router.get('*', fetchData);

router.get('*', async (ctx) => {
  await ctx.render('index.html', {
    ...ctx.state,
  });
});

exports.router = router;
