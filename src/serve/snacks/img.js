const monk = require('monk');
const axios = require('axios');
const uuid = require('uuid/v1');
const { CancelToken } = require('axios');
const cheerio = require('cheerio');

const https = require('https');

const request = require('request');
const fs = require('fs');
const qiniu = require('qiniu');


const db = monk('localhost/poetry');
const author = db.get('author');
const failSave = db.get('fail');
const accessKey = 'tEPAzHn8dRG5UzoseWvDxi6LnqBOO4MrQ0c6HYpR';
const secretKey = '2Eo-j21dpcso3zbGfmIiU_DbTIJ_J4-YCAVE9ChA';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const putPolicy = new qiniu.rs.PutPolicy({
  scope: 'jjsing',
});
const uploadToken = putPolicy.uploadToken(mac);
let timer = null;
function uploadQiNiu(stream, key) {
  return new Promise((resolve, reject) => {
    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z2;
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const readableStream = stream; // 可读的流
    formUploader.putStream(uploadToken, key, readableStream, putExtra, (respErr,
      respBody, respInfo) => {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode === 200) {
        resolve(respBody);
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
        reject();
      }
    });
  });
}

function loadImg(url) {
  const reg = /(jpg)|(jpeg)|(png)/i;
  const ext = reg.exec(url)[1];
  const key = `images/${uuid()}.${ext}`;
  console.log(key);
  return uploadQiNiu(request(url), key);
}

function getQiNiuUrl(name) {
  return new Promise(async (resolve, reject) => {
    let cancel = null;
    try {
      timer = setTimeout(() => {
        console.log('超时了!');
        cancel();
      }, 3000);
      const html = await axios.get(`https://baike.baidu.com/item/${encodeURIComponent(name)}`, {
        cancelToken: new CancelToken((c) => {
          cancel = c;
        }),
      });
      clearTimeout(timer);
      const $ = cheerio.load(html.data, { decodeEntities: false });
      const root = $('.summary-pic');
      const img = root.find('img');
      if (img.length) {
        const src = img.attr('src');
        try {
          const url = await loadImg(src);
          resolve(url);
        } catch (err) {
          reject(name);
        }
      } else {
        throw Error('no img');
      }
    } catch (err) {
      reject(name);
    }
  });
}

async function fetch() {
  const list = await author.find({});
  let i = 6533;
  async function get() {
    try {
      console.log(list[i].name);
      const url = await getQiNiuUrl(list[i].name);
      if (url.key) {
        await author.findOneAndUpdate({
          name: list[i].name,
        }, {
          $set: {
            imgUrl: `https://static.jjsing.com/${url.key}`,
          },
        });
      } else {
        throw new Error(list[i].name);
      }
      i += 1;
      console.log(`完成图片${url.key}`);
      get();
    } catch (err) {
      await failSave.insert({
        name: err.toString(),
      });
      i += 1;
      get();
      console.log(`${err}错误了`);
    }
  }
  get();
}
fetch();
