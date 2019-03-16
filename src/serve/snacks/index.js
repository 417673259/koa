const axios = require('axios');
const cheerio = require('cheerio');
const { domain } = require('../const');

// 作者列表

async function authorList() {
  await authorPage(1); 
}

// 作者明显

async function authorPage(index = 1) {
  try {
    const html = await axios.get(`http://www.shicimingju.com/category/all__${index}`)
    .then(req => req.data);
    const $ = cheerio.load(html);
    const container = $('.www-main-container');
    const list = container.find('h3');
    const nextUrl = [];
    list.each((i, el) => {
      nextUrl.push($(el).find('a').attr('href'));
  });
  console.log(nextUrl);
  } catch(err) {
    console.log(err);
  }
}


// 分页循环
async function totalPage() {

}

// 某一页
async function listPage(index = 1) {
  try {
    const html = await axios.get(`${domain}/chaxun/zuozhe/${index}.html`)
    .then(req => req.data)
    const $ = cheerio.load(html);
    const container = $('.www-main-container');
    const h3 = container.find('h3');
    const nextUrl = [];
    h3.each((i, el) => {
      nextUrl.push($(el).find('a').attr('href'))
    });
    console.log(nextUrl);
    return nextUrl;
  } catch (err) {
    console.error(err);
  }
}

// 详情页
async function indexPage(pageUrl) {
  try {
    const html = await axios.get(`${domain}${pageUrl}`)
    .then(req => req.data)
    const data = {};
    const $ = cheerio.load(html, {decodeEntities: false});
    
    const container = $('.shici-title');
    data.title =container.text();

    const info = $('.shici-info').text().trim();
    const reg1 = /\[(.+)\](.+)/g;
    const [, dynasty ,author] = reg1.exec(info);
    data.author = author;
    data.dynasty = dynasty;
    
    const content = $('.shici-content').text().trim();
    data.content = content;

    const label = [];
    $('.shici-mark a').each((i, el) => {
      label.push($(el).text().trim());
    });
    data.label = label;
    const summary = $('.shangxi-container').html();
    data.summary = summary;

    return data;

  } catch(err) {
    console.error(err);
  }
}
exports.indexPage = indexPage;
exports.listPage = listPage;
exports.authorList = authorList;