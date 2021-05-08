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
async function getList(req, res, next) {
    if (validaErr(req, res, next)) {
        let arr = ['国产剧', '港台剧', '日韩剧', '欧美剧', '泰国剧', '海外剧'];

        const array = [];

        for (let i = 0; i < arr.length; i++) {
            let sql = `SELECT * FROM teleplay WHERE type LIKE '%${arr[i]}%' LIMIT 0,6 `;
            await querySql(sql).then(data => {
                if (data.length != 0) {
                    array.push({ title: arr[i], list: data })
                }
            })
        }

        let query = `SELECT * FROM teleplay WHERE updateTime LIKE '%2021-04%' LIMIT 0,3`;
        querySql(query).then(data => {
            res.json({
                code: CODE_SUCCESS,
                msg: '电视剧列表',
                data: {
                    array: array,
                    list: data
                },
            })

        })
    }

}


function getTeleplayDetails(req, res, next) {
    const { id } = req.query;
    console.log(id);

    let sql = `SELECT * FROM teleplay WHERE id = '${id}'`;
    queryOne(sql).then(data => {
        data.path = JSON.parse(data.path);

        res.json({
            code: CODE_SUCCESS,
            msg: '电视剧详情',
            data: data
        })
    })


}


module.exports = {
    getList,
    getTeleplayDetails
}