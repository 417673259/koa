const monk = require('monk');

const db = monk('localhost/poetry');
const { CancelToken } = require('axios');
const cheerio = require('cheerio');
const axios = require('../lib/axios');

const url = db.get('author');
const fail = db.get('fail');
const ids = db.get('ids');
const max = 90;
let now = 1;
// 作者明显
let timer = null;
async function authorPage() {
  let cancel = null;
  try {
    timer = setTimeout(() => {
      console.log('超时了!');
      cancel();
    }, 3000);
    let html = await axios.get(`http://www.shicimingju.com/chaxun/zuozhe/${now}.html`, {
      cancelToken: new CancelToken((c) => {
        cancel = c;
      }),
    });
    clearTimeout(timer);
    html = html.data;
    // const { num } =  await ids.findOne({id: 'author'});
    const data = {};
    const $ = cheerio.load(html, { decodeEntities: false });
    const container = $('.zuozhe-header');

    const name = container.find('h2 a');
    data.name = name.text();

    const alias = container.find('.chenghao');
    data.alias = alias.text().replace(/[\(\)]/g, '');

    const famous = container.find('h6');
    data.famous = [];
    if (famous && famous.length) {
      famous.each((i, el) => {
        data.famous.push($(el).find('a').text());
      });
    }

    const divDom = container.find('.sub-inline-title');
    data.dynasty = divDom.eq(0).parent().text().replace('年代：', '');
    data.total = divDom.eq(1).parent().text().replace(/[^\d]/g, '');

    data.summary = container.find('.summary').html();
    data.id = 13000 + now;
    const isAready = url.findOne({ name: data.name });
    if (!isAready.length && now < 80) {
      await Promise.all([
        url.insert(data),
        // ids.update({id: 'author'}, {  id: 'author', num: num + 1 }),
      ]);
      console.log(`成功了: ${data.name}-${now}`);
      now += 1;
      authorPage();
    } else {
      console.log(isAready);
    }
  } catch (err) {
    console.log(`err:${err.message}`);
    clearTimeout(timer);
    await fail.insert({ url: `http://www.shicimingju.com/chaxun/zuozhe/${now}.htm` });
    now += 1;
    if (now < max) {
      authorPage();
    }
  }
}
authorPage();
