/**
 * @描述：视频弹幕
 * @作者: mzz
 * @日期: 2021-04-13 17:52:27
 * @更新日期：2021-04-13 17:52:27
 */

 const express = require('express');
 const router = express.Router();
 const { body, query } = require('express-validator');
 const service = require('../services/danmaku');


 router.get('/getDanmaku',service.getDanmaku);
 router.get('/getDanmaku/v3/',service.getDanmaku);
 router.post('/getDanmaku/v3/',service.updateDanmaku);

 module.exports = router;