/**
 * 描述: 用户路由模块
 * 作者: Jack Chen
 * 日期: 2020-06-20
*/

const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const service = require('../services/videoService');




// 获取视频列表
router.get('/getVideo', service.getVideo);



module.exports = router;

