/**
 * 描述: 用户路由模块
 * 作者: Jack Chen
 * 日期: 2020-06-20
*/

const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const service = require('../services/foundService');

//通过用户名查询用户信息
router.post('/found/update', service.foundUpdate);

router.get('/found/getData',service.foundGetData)


module.exports = router;
