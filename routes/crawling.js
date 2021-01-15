/**
 * @描述：爬取数据路由
 * @作者: mzz
 * @日期: 2021-01-12 22:14:56
 * @更新日期：2021-01-12 22:14:56
 */

const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const service = require('../services/crawlingService');


router.get('/crawlVideo',service.crawlVideo)
// router.get('/crawlVideoDetails',service.crawlVideoDetails)
// router.get('/crawlVideoPath',service.crawlVideoPath)


module.exports = router;