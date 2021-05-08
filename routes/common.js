/**
 * 描述: 用户路由模块
 * 作者: Jack Chen
 * 日期: 2020-06-20
*/

const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const service = require('../services/commonService');





//搜索
router.get('/search', service.getSearch)

//分类
router.get('/screen', service.getScreen)

//分类列表
router.get('/screen/list',service.getScreenList)


//首页精选列表
router.get('/recom/list',service.getRecomList)



module.exports = router;

