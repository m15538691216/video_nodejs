/*
 * @Author: Mzz 
 * @Date: 2020-12-25 10:05:25 
 * @Last Modified by: Mzz
 * @Last Modified time: 2020-12-26 15:17:27
 * 描述：视频相关接口
 */

const { querySql, queryOne } = require('../utils/index');
const boom = require('boom');
const { validationResult } = require('express-validator');
const { CODE_ERROR, CODE_SUCCESS } = require('../utils/constant');


//查询视频筛选 地区 类型 数据
function getLabel(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { id } = req.query;
        let query = `SELECT * FROM product WHERE id = ${id}`;
        queryOne(query).then(data => {
            res.json({
                code: CODE_SUCCESS,
                msg: `筛选数据`,
                data: data
            })
        })
    }
}


module.exports = {
    getLabel,
}

