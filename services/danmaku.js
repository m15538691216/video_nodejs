/**
 * @描述：视频弹幕
 * @作者: mzz
 * @日期: 2021-04-13 17:52:07
 * @更新日期：2021-04-13 17:52:07
 */

const { querySql, queryOne, validaErr, toLiteral } = require('../utils/index');
const boom = require('boom');
const { validationResult } = require('express-validator');
const { CODE_ERROR, CODE_SUCCESS } = require('../utils/constant');

function getDanmaku(req, res, next) {
    if (validaErr(req)) {
        const { id, max } = req.query;
        let query = `SELECT * FROM danmaku WHERE player = '${id}' LIMIT ${max}`
        querySql(query).then(data => {
            let arrays = []
            for (let i = 0; i < data.length; i++) {
                let array = [];
                array.push(data[i].time)
                array.push(data[i].type)
                array.push(parseInt(data[i].color))
                array.push(data[i].player)
                array.push(data[i].text)
                // array.push(data[i].author);
                arrays.push(array)
            }
            res.json({
                code: 0,
                msg: '查询成功',
                data: arrays
            })
        })
    }
}

function updateDanmaku(req, res, next) {
    if (validaErr(req)) {
        const { author, color, id, text, time, token, type } = req.body;
        let query = `INSERT INTO danmaku SET player='${id}',text='${toLiteral(text)}',author='${author}',color="${color}",time="${time}",type="${type}"`
        querySql(query).then(data => {
            res.json({
                code: 0,
                msg: '已发送',
                data: ''
            })
        })
    }
}




module.exports = {
    getDanmaku,
    updateDanmaku
}