const monk = require('monk');

const db = monk('localhost/poetry');
const author = db.get('author');

// 拉作者列表
export function fetchAuthorList({
  pageSize = 10,
  pageNo = 1,
}) {
  return author.find({},
    {
      sort: { like: -1 },
      limit: +pageSize,
      skip: (pageNo - 1) * pageSize,
    });
}

export function fetchAuthorDetail({ id }) {
  console.log(id, '2222222');
  return author.findOne({
    id: +id,
  });
}

export default {
  fetchAuthorList,
  fetchAuthorDetail,
};
