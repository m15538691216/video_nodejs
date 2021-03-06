/**
 * @描述：电视剧模块
 * @作者: mzz
 * @日期: 2021-04-17 15:21:17
 * @更新日期：2021-04-17 15:21:17
 */

const { querySql, queryOne, validaErr } = require('../utils/index');
const {
    CODE_ERROR,
    CODE_SUCCESS,
} = require('../utils/constant');

//获取电视剧列表
function getList(req, res, next) {
    if (validaErr(req, res, next)) {
        let { sort, count } = req.query;
        let sql = `SELECT COUNT(*) as total FROM anime`;
        queryOne(sql).then(data => {
            let query = `SELECT * FROM anime ORDER BY ${sort} DESC LIMIT ${count}`;
            querySql(query).then(data2 => {
                res.json({
                    code: CODE_SUCCESS,
                    msg: '动漫列表',
                    data: {
                        list: data2,
                        total: data.total
                    }
                })

            })
        })



    }

}


//获取详情
function getDetails(req, res, next) {
    if (validaErr(req, res, next)) {
        let { id } = req.query;
        let sql = `SELECT * FROM anime WHERE id = '${id}'`;
        queryOne(sql).then(data => {
            data.path = JSON.parse(data.path)
            res.json({
                code: CODE_SUCCESS,
                msg: '详情列表',
                data: data
            })
        })

    }
}




module.exports = {
    getList,
    getDetails
}