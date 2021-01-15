/**
 * @描述：封装md5方法
 * @作者: mzz
 * @日期: 2021-01-10 22:43:17
 * @更新日期：2021-01-10 22:43:17
 */

const crypto = require('crypto'); // 引入crypto加密模块

function md5(s) {
  return crypto.createHash('md5').update('' + s).digest('hex');
}

module.exports = md5;