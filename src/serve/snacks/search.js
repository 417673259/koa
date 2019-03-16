const monk = require('monk');
const db = monk('localhost/poetry');
const author = db.get('author');

async function cs () { 
  console.time('a');
  await author.find({id: 6723});
  console.timeEnd('a');
}
cs();