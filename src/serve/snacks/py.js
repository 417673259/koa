const monk = require('monk');

const db = monk('localhost/poetry');
const author = db.get('author');
const axios = require('../../lib/axios');
const { CancelToken } = require('axios');

const pys = db.get('pinyin');

const max = 13075;
let id = 13001;
let cancel;
let timer = null;


function getPy(text) {
  return axios.get('http://hn2.api.okayapi.com/', {
    params: {
      app_key: 'F3BB2AF794FDB1F860F4DF25F65D1F23',
      text,
      s: 'Ext.Pinyin.Name',
    },
    cancelToken: new CancelToken((c) => {
      cancel = c;
    }),
  });
}

async function getAuthor() {
  try {
    const [authorData] = await author.find({ id });
    const { name } = authorData;
    const { data: { data } } = await getPy(name);
    const { pinyin } = data;
    timer = setTimeout(() => {
      console.log('超时了!');
      cancel(name);
    }, 3000);
    await author.update({ id }, {
      ...authorData,
      pinyin,
    });
    clearTimeout(timer);
    console.log(`${authorData.name}：${pinyin}`);
    id += 1;
    if (id < max) {
      getAuthor();
    }
  } catch (name) {
    console.log(`fail: ${name}`);
    clearTimeout(timer);
    await pys.insert({
      id,
      name,
    });
    id += 1;
    if (id < max) {
      getAuthor();
    }
  }
}

getAuthor();
