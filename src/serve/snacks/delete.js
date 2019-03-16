const monk = require('monk');

const db = monk('localhost/poetry');
const axios = require('axios');


const author = db.get('author');
const authorList = [
  '柳宗元', '辛弃疾', '王安石', '温庭筠', '秦观', '柳永', '柳宗元', '韩愈', '李贺', '韩翃', '陈子昂', '王勃', '王昌龄', '刘禹锡', '李商隐',
  '杜牧', '孟浩然', '骆宾王', '曾巩', '欧阳修', '岑参', '范仲淹', '曹操', '曹植', '屈原',
  '李贺', '毛泽东', '黄庭坚', '贺知章', '孟郊', '鱼玄机', '苏辙', '苏洵', '卢照邻', '卓文君', '上官昭容', '蔡琰', '嵇康', '阮籍',
  '马致远', '关汉卿', '白朴', '郑光祖', '杨炯', '杨万里', '范成大', '尤袤',
];

async function find() {
  async function change() {
    try {
      const { summary } = await author.findOne({ name: '韩翃' });
      await author.findOneAndUpdate({ name: '韩翃' }, {
        $set: {
          summary: summary.replace(/\/?<[^<>]+>/g, ''),
        },
      });
      console.log('success');
    } catch (err) {
      console.log(err);
    }
  }
  change();
}
find();
