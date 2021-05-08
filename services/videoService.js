/*
 * @Author: Mzz 
 * @Date: 2020-12-25 10:05:25 
 * @Last Modified by: mzz
 * @Last Modified time: 2021-04-17 14:38:52
 * 描述：视频相关接口
 */

const { querySql, queryOne, validaErr } = require('../utils/index');
const boom = require('boom');
const { validationResult } = require('express-validator');
const {
    CODE_ERROR,
    CODE_SUCCESS,
} = require('../utils/constant');

//查询视频列表 动作 战争 剧情 爱情 科幻 恐怖 喜剧
async function getVideo(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        const arrary = [];
        let types = ['动作', '战争', '剧情', '爱情', '科幻', '恐怖', '喜剧'];
        for (let i = 0; i < types.length; i++) {
            let query = `SELECT * FROM video WHERE type LIKE "%${types[i]}%" LIMIT 0,6`;
            await querySql(query).then(data => {
                arrary.push({ title: types[i], list: data })

            })
        }

        let query = `SELECT * FROM video WHERE updateTime LIKE '%2021-04%' LIMIT 0,3`;
        querySql(query).then(data => {
            res.json({
                code: CODE_SUCCESS,
                msg: '视频列表',
                data: {
                    arrary: arrary,
                    list: data
                },
            })

        })

    }
}

//查询视频详情
function getDetails(req, res, next) {
    if (validaErr(req)) {
        let { id } = req.query;
        let sql = `SELECT * FROM video WHERE id = '${id}'`

        queryOne(sql).then(data => {
            data.path = JSON.parse(data.path)
            res.json({
                code: CODE_SUCCESS,
                msg: '视频详情',
                data: data
            })
        })


    }
}


module.exports = {
    getVideo,
    getDetails
}

