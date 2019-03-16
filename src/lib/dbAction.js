const monk = require('monk');

const db = monk('localhost/poetry');
const author = db.get('author');

export function a() {

}

export function fetchAuthorList({
  pageSize = 10,
  pageNo = 1,
}) {
  return author.find({},
    {
      sort: { score: 1 },
      limit: pageSize,
      skip: (pageNo - 1) * pageSize,
    });
}
