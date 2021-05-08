const { querySql, queryOne, validaErr, toLiteral } = require('../utils/index');
const md5 = require('../utils/md5');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const userJwt = require('../utils/user-jwt');
const { body, validationResult } = require('express-validator');

const formidable = require("formidable");
const qiniu = require('qiniu');
const { qiniuToken } = require('../utils/qiniu')

const {
    CODE_ERROR,
    CODE_SUCCESS,
    PRIVATE_KEY,
    JWT_EXPIRED,
    REFRESH_TOKEN_EXPIRED
} = require('../utils/constant');

function foundUpdate(req, res, next) {
    if (validaErr(req)) {
        let { text, file } = req.body;
        let { userInfo } = req.user;

        console.log(text, file);

        let query = `INSERT INTO found SET uid='${userInfo.userId}',text='${toLiteral(text)}',image='${file}',praise="0",news="0"`;
        querySql(query).then(data => {
            console.log(data);
            res.json({
                code: CODE_SUCCESS,
                msg: '添加成功',
                data: ''
            })
        }).catch(err => {
            res.json({
                code: CODE_ERROR,
                msg: '添加失败',
                data: ''
            })
        })


    }
}

function foundGetData(req, res, next) {
    if (validaErr(req)) {
        let query = `SELECT found.*, user.name,user.avator FROM found, user WHERE found.uid = user.id`;
        querySql(query).then(data => {
            data.forEach(ele => {
                ele.image = ele.image == null ? '' : JSON.parse(ele.image)
            });

            res.json({
                code: CODE_SUCCESS,
                msg: '查询成功',
                data: data
            })
        })
    }
}





module.exports = {
    foundUpdate,
    foundGetData
}
