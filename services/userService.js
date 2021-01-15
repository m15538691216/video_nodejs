/**
 * 描述: 业务逻辑处理 - 用户相关接口
 * 作者: Jack Chen
 * 日期: 2020-06-20
*/


const { querySql, queryOne } = require('../utils/index');
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
    let { username, password } = req.body;
    // md5加密
    // password = md5(password);
    const query = `select * from user where name='${username}' and password='${password}'`;
    querySql(query)
      .then(user => {
        if (!user || user.length === 0) {
          res.json({
            code: CODE_ERROR,
            msg: '用户名或密码错误',
            data: null
          })
        } else {
          const accessToken = userJwt.token(username)
          const refreshToken = userJwt.refreshToken(username)
          let userData = {
            id: user[0].id,
            username: user[0].username,
            nickname: user[0].nickname,
            avator: user[0].avator,
            sex: user[0].sex,
            gmt_create: user[0].gmt_create,
            gmt_modify: user[0].gmt_modify
          };
          // res.cookie("jwt", accessToken, { secure: true, httpOnly: true })
          // res.cookie("jwt", accessToken, { maxAge: JWT_EXPIRED * 1000, signed: false, httpOnly: true });//设置cookie  secure 开启https
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


//获取个人信息
function findeUser(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {

    let { username } = req.query;
    findUser(username).then(data => {
      next()
      if (data) {
        res.json({
          code: CODE_SUCCESS,
          msg: "",
          data: data
        })
      } else {
        res.json({
          code: CODE_SUCCESS,
          msg: "没有该用户！",
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
    const username = userJwt.decode(req)
    const accessToken = userJwt.token(username)
    const refreshToken = userJwt.refreshToken(username)
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



module.exports = {
  login,
  findeUser,
  getrefreshToken
}
