/*
 * @Author: Mzz 
 * @Date: 2020-12-25 10:05:25 
 * @Last Modified by: mzz
 * @Last Modified time: 2021-04-24 17:13:11
 * 描述：视频相关接口
 */

const { querySql, queryOne, validaErr } = require('../utils/index');
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

//搜索资源
async function getSearch(req, res, next) {
    if (validaErr(req)) {
        let { title, text } = req.query;
        let arr = ['video', 'anime', 'teleplay', 'variety'];
        let array = [];
        for (let i = 0; i < arr.length; i++) {
            let query = `SELECT * FROM ${arr[i]} WHERE pname LIKE '%${text}%'`;
            await querySql(query).then(data => {
                for (const ele of data) {
                    ele.sort = arr[i]
                }
                let arr1 = [...array, ...data];
                array = Array.from(new Set(arr1));
                if (arr[i] == 'variety') {
                    res.json({
                        code: CODE_SUCCESS,
                        msg: `搜索数据`,
                        data: array
                    })
                }
            })
        }

    }
}

//
function getScreen(req, res, next) {
    if (validaErr(req)) {
        let { title } = req.query;
        let query = `SELECT * FROM product WHERE name = '${title}'`;
        queryOne(query).then(data => {
            data.regions = JSON.parse(data.regions);
            data.type = JSON.parse(data.type);
            data.sort = JSON.parse(data.sort);
            res.json({
                code: CODE_SUCCESS,
                msg: `搜索数据`,
                data: data
            })
        })
    }
}

function getScreenList(req, res, next) {
    if (validaErr(req)) {
        let { year, type, sort, city, count, title } = req.query;
        let sqlName = 'video';
        //查询评分
        let orderBy = '';
        if (sort == '最新排序') {
            orderBy = 'updateTime'
        } else if (sort == '人气排序') {
            orderBy = 'releaseTime'
        } else {
            orderBy = '""';
        }
        if (title == '电影') {
            sqlName = 'video';
        } else if (title == '电视剧') {
            sqlName = 'teleplay'
        } else if (title == '动漫') {
            sqlName = 'anime'
        } else if (title == '综艺') {
            sqlName = 'variety'
        }

        queryOne(`SELECT COUNT(*) total FROM ${sqlName} WHERE type LIKE '%${type}%' AND city LIKE '%${city}%' AND releaseTime LIKE '%${year}%'`).then(total => {
            let query = `SELECT * FROM ${sqlName} WHERE type LIKE '%${type}%' AND city LIKE '%${city}%' AND releaseTime LIKE '%${year}%' ORDER BY ${orderBy} desc limit ${count}`;
            querySql(query).then(data => {
                res.json({
                    code: CODE_SUCCESS,
                    msg: `搜索数据`,
                    data: {
                        total: total.total,
                        list: data
                    }
                })
            })

        })



    }
}

//首页精选列表
async function getRecomList(req, res, next) {
    if (validaErr(req, res, next)) {
        let arr = [{ title: '电影热映', text: 'video' }, { title: '热播电视', text: 'teleplay' }, { title: '动漫卡通', text: 'anime' }, { title: '综艺娱乐', text: 'variety' }];
        
        let array = [];
        for (let i = 0; i < arr.length; i++) {
            let query = `SELECT * FROM ${arr[i].text} ORDER BY updateTime  LIMIT 6`;
            await querySql(query).then(data => {
                array.push({ title: arr[i].title, list: data })
                if (arr[i].text == 'variety') {
                    res.json({
                        code: CODE_SUCCESS,
                        msg: `搜索数据`,
                        data: array
                    })
                }
            })
        }
    }
}


module.exports = {
    getSearch,
    getScreen,
    getScreenList,
    getRecomList
}

