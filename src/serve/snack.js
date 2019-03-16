const monk = require('monk');

const db = monk('localhost/poetry');
const axios = require('axios');

const poetrys = db.get('poetrys');
const cheerio = require('cheerio');

const author = db.get('author');

async function search() {
  const data = await author.find({
    id: '13001',
  });
  console.log(data);
}

search();
