/**
 * 描述: jwt-token验证和解析函数
 * 作者: Jack Chen
 * 日期: 2020-06-20
*/

const jwt = require('jsonwebtoken'); // 引入验证jsonwebtoken模块
const expressJwt = require('express-jwt'); // 引入express-jwt模块
const { PRIVATE_KEY, JWT_EXPIRED, REFRESH_TOKEN_EXPIRED } = require('./constant'); // 引入自定义的jwt密钥

// 验证token是否过期
const jwtAuth = expressJwt({
  // 设置密钥
  secret: PRIVATE_KEY,
  // 设置为true表示校验，false表示不校验
  credentialsRequired: true,
  // 自定义获取token的函数
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    }
  }
  // 设置jwt认证白名单，比如/api/login登录接口不需要拦截
}).unless({
  path: [
    '/',
    '/api/login',
    '/api/getVideo',
    '/api/getVideo/details',
    '/api/screen',
    '/api/search',
    '/api/screen/list',
    '/api/crawl/crawlVideo',
    '/api/crawl/getVideo',
    '/api/crawl/crawlVideoPath',
    '/api/found/getData',
    '/api/getDanmaku',
    '/api/getDanmaku/v3/',
    '/api/teleplay/getList',
    '/api/teleplay/details',
    '/api/anime/getList',
    '/api/anime/getDetails',
    '/api/variety/getList',
    '/api/variety/getDetails',
    '/api/recom/list'


  ]
})

// jwt-token解析
function decode(req) {
  const token = req.headers.authorization.split(' ')[1];
  return jwt.verify(token, PRIVATE_KEY, { ignoreNotBefore: true });
}


function token(userInfo) {
  const token = jwt.sign(
    { userInfo },
    PRIVATE_KEY,
    { expiresIn: JWT_EXPIRED }
  )
  return token;
}

function refreshToken(userInfo) {
  const refreshToken = jwt.sign(
    { userInfo },
    PRIVATE_KEY,
    {
      expiresIn: REFRESH_TOKEN_EXPIRED,
      notBefore: JWT_EXPIRED
    },
  )

  return refreshToken;
}

module.exports = {
  jwtAuth,
  decode,
  token,
  refreshToken
}
