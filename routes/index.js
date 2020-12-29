/**
 * 描述: 初始化路由信息，自定义全局异常处理
 * 作者: Jack Chen
 * 日期: 2020-06-19
*/

const express = require('express');
const { jwtAuth, decode } = require('../utils/user-jwt'); // 引入jwt认证函数
const router = express.Router(); // 注册路由 
// const boom = require('boom'); // 引入boom模块，处理程序异常状态


const userRouter = require('./users'); // 引入user路由模块
const videoRouter = require('./video'); // 引入video路由模块
const CommonRouter = require('./common'); // 引入video路由模块



router.use(jwtAuth); // 注入认证模块

router.use('/api', userRouter); // 注入用户路由模块
router.use('/api', videoRouter); // 注入视频路由模块
router.use('/api', CommonRouter); // 注入视频路由模块


// 自定义统一异常处理中间件，需要放在代码最后
router.use(function (err, req, res, next) {
  // 自定义用户认证失败的错误返回
  // console.log('err===', err);
  if (err && err.name === 'UnauthorizedError') { //jwt malformed
    const { status = 401, message } = err;
    // 抛出401异常
    res.status(status).json({
      code: status,
      msg: 'token失效，请刷新',
      data: null
    })
  } else {
    const { output } = err || {};
    // 错误码和错误信息
    const errCode = (output && output.statusCode) || 500;
    const errMsg = (output && output.payload && output.payload.error) || err.message;
    res.status(errCode).json({
      code: errCode,
      msg: errMsg
    })
  }
})

module.exports = router;