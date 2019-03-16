const monk = require('monk');
const db = monk('localhost/poetry');
const axios = require('../../lib/axios');
const { CancelToken } = require('axios');
const cheerio = require('cheerio');
const url = db.get('author');
const fail = db.get('fail');
const next = db.get('next');
const ids = db.get('ids');
const max = 13087;
let now = 1;
// 作者明显
let timer = null;


async function fetchFailList() {
  const list = await fail.find();
  let i = 0;

    
  async function authorPage() {
    let cancel = null;
    try {
      timer = setTimeout(() => {
        console.log('超时了!');
        cancel();
      }, 3000);
      let html = await axios.get(`${list[i].url}l`, {
        cancelToken: new CancelToken((c) => {
          cancel = c;
        })
      });
      clearTimeout(timer);
      html = html.data;
      const { num } =  await ids.findOne({id: 'author'});
      const data = {};
      const $ = cheerio.load(html, {decodeEntities: false});
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
      data.id = num;
  
      await Promise.all([
        url.insert(data),
        ids.update({id: 'author'}, {  id: 'author', num: num + 1 }),
      ]); 
      console.log(`成功了: ${data.name}-${now}`);
    now += 1;  
    if (now < list.length) {
      authorPage();
    } else{
      console.log('over');
    }
    
    } catch(err) {
      console.log(`err:${err.message}`);
      clearTimeout(timer);
      await next.insert({url : list[i].url});
      now += 1;
    if (now < list.length) {
      authorPage();
      }
    }
  }
  authorPage();

}
fetchFailList();


