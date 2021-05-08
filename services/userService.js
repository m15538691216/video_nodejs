/**
 * 描述: 业务逻辑处理 - 用户相关接口
 * 作者: Jack Chen
 * 日期: 2020-06-20
*/


const { querySql, queryOne, validaErr } = require('../utils/index');
const { qiniuToken } = require('../utils/qiniu')
const md5 = require('../utils/md5');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const userJwt = require('../utils/user-jwt');
const { body, validationResult } = require('express-validator');
const {
  CODE_ERROR,
  CODE_SUCCESS,
  PRIVATE_KEY,
  JWT_EXPIRED,
  REFRESH_TOKEN_EXPIRED
} = require('../utils/constant');


// 登录
function login(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { userPhone, passWord } = req.body;

    // md5加密
    // password = md5(password);
    const query = `select * from user where phone='${userPhone}' and password='${passWord}'`;
    queryOne(query)
      .then(user => {
        if (!user) {
          res.json({
            code: CODE_ERROR,
            msg: '用户名或密码错误',
            data: null
          })
        } else {
          const accessToken = userJwt.token({ userName: user.name, userId: user.id })
          const refreshToken = userJwt.refreshToken({ userName: user.name, userId: user.id })
          let userData = {
            id: user.id,
            userName: user.name,
            nickName: user.nickname,
            avator: user.avator,
            sex: user.sex,
            gmt_create: user.gmt_create,
            gmt_modify: user.gmt_modify
          };
          res.json({
            code: CODE_SUCCESS,
            msg: '登录成功',
            data: {
              accessToken,
              refreshToken,
              userData
            }
          })
        }
        next();
      })

  }
}

//注销登录
function outLogin(req, res, next) {
  if (validaErr(req)) {

  }
}


//获取个人信息
function findeUser(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    const { userInfo } = userJwt.decode(req);
    const query = `select * from user where id ='${userInfo.userId}'`;
    queryOne(query).then(user => {
      delete user.password
      if (user) {
        res.json({
          code: CODE_SUCCESS,
          msg: "",
          data: user
        })
      } else {
        res.json({
          code: CODE_ERROR,
          msg: "暂无此人！",
          data: ""
        })
      }

    })


  }

}

//刷新token
function getrefreshToken(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    const { userInfo } = userJwt.decode(req)

    const accessToken = userJwt.token({ userName: userInfo.userName, userId: userInfo.userId })
    const refreshToken = userJwt.refreshToken({ userName: userInfo.userName, userId: userInfo.userId })
    res.json({
      code: CODE_SUCCESS,
      msg: "刷新token",
      data: {
        accessToken,
        refreshToken
      }
    })
  }
}

// 校验用户名和密码
function validateUser(username, oldPassword) {
  const query = `select id, username from sys_user where username='${username}' and password='${oldPassword}'`;
  return queryOne(query);
}

// 通过用户名查询用户信息
function findUser(username) {
  const query = `select id, name from user where name='${username}'`;
  return queryOne(query);
}

//
function getQiniuToken(req, res, next) {
  if (validaErr(req)) {
    res.json({
      code: CODE_SUCCESS,
      msg: "七牛云Token",
      data: {
        qiniuToken:qiniuToken()
      }
    })
  }
}



module.exports = {
  login,
  findeUser,
  getrefreshToken,
  getQiniuToken
}
