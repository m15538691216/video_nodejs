/**
 * @描述：爬取数据服务
 * @作者: mzz
 * @日期: 2021-01-12 22:11:11
 * @更新日期：2021-01-12 22:11:11
 */

let request = require('request');
let cheerio = require('cheerio');
let moment = require('moment');
const { querySql, queryOne, validaErr, toLiteral } = require('../utils/index');
const { CODE_ERROR, CODE_SUCCESS } = require('../utils/constant');
const URL = `http://m.kuaikan33.com`;
const fs = require('fs')
const path = require('path')
const { v1: uuidv1 } = require('uuid');

let file = path.resolve(__dirname, '../json/path.txt');
let fileVideo = path.resolve(__dirname, '../json/video.txt');


let mapLimit = (list, limit, asyncHandle) => {
    let recursion = (arr) => {
        return asyncHandle(arr.shift())
            .then(() => {
                if (arr.length !== 0) return recursion(arr)   // 数组还未迭代完，递归继续进行迭代
                else return 'finish';
            })
    };

    let listCopy = [].concat(list);
    let asyncList = []; // 正在进行的所有并发异步操作
    while (limit--) {
        asyncList.push(recursion(listCopy));
    }
    return Promise.all(asyncList);  // 所有并发异步操作都完成后，本次并发控制迭代完成
}


//http://www.wbdy.tv/vodlist/id-1-pg-2-order--by--class-0-year-0-letter--area--lang-.html

function crawlVideo(req, res, next) {
    if (validaErr(req)) {
        fs.readFile(fileVideo, 'utf-8', (err, data) => {
            let array = JSON.parse(data).slice(1001,1929);
            var count = 0;
            mapLimit(array, 1, (curItem) => {
                return new Promise(resolve => {
                    count++
                    setTimeout(() => {
                        console.log(curItem.pname);
                        getDetails(curItem.href)
                        resolve();
                    }, Math.random() * 10000)
                });
            }).then(response => {
                console.log('finish', response)
            })
        })
        // getDetails('http://www.wbdy.tv/vod/562.html')

        res.json({
            code: CODE_SUCCESS,
            msg: '视频列表',
            data: ''
        })
    }

}



function getDetails(url) {
    request.get(url, async (error, response, body) => {
        const $ = cheerio.load(body);
        let coverImg = $('.loadpic img').attr('data-src');
        let pname = $('tbody tr').eq(0).text().replace('片名：', '');
        let clarity = $('tbody tr').eq(1).text().replace('状态：', '');
        let director = $('tbody tr').eq(2).text().replace('导演：', '');
        let performer = $('tbody tr').eq(3).text().replace('主演：', '');
        let releaseTime = $('tbody tr').eq(4).text().replace('年代：', '');
        let city = $('tbody tr').eq(6).text().replace('地区：', '');
        let type = $('tbody tr').eq(5).text().replace('分类：', '');
        let language = $('tbody tr').eq(7).text().replace('语言：', '');
        let updateTime = $('tbody tr').eq(8).text().replace('更新时间：', '');
        let introduction = $('.content p').eq(-1).html();
        //获取电影
        // let href = 'http://www.wbdy.tv' + $('#tab_1 a').attr('href');
        //获取电视剧
        let arr = $('#tab_1 a').map((i, ele) => {
            let href = 'http://www.wbdy.tv' + $(ele).attr('href');
            let title = $(ele).text();
            return { href: href, title: title }
        }).get();


        let obj = {
            pname: pname,
            clarity: clarity,
            director: director,
            performer: performer,
            releaseTime: releaseTime,
            city: city,
            type: type,
            language: language,
            updateTime: updateTime,
            introduction: introduction,
            coverImg: coverImg
        }

        // getM3u8(href, obj);
        var count = 0;
        var array = [];
        mapLimit(arr, 1, (curItem) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    getM3u8(curItem.href).then(data => {
                        console.log(curItem.title + "-----" + data);
                        array.push({ title: curItem.title, path: data, uuid: uuidv1() });
                        obj.path = array;
                        count += 1
                        if (count == arr.length) {
                            setMySql(obj);
                        }
                        resolve();
                    });
                }, Math.random() * 5000)
            });
        }).then(response => {
            console.log('finish', response)
        })

    })
}

function getM3u8(url, obj) {
    return new Promise(resolve => {
        request.get(url, async (error, response, body) => {
            const $ = cheerio.load(body);
            let html = $('.pbbox').html();
            // var regex = /url=(.+?)&amp/g;
            var regex = /url=(.+?)&/g;
            var result = regex.exec(html)[1];
            let pname = $('.panel-body.content .colEx h2').html()
            resolve(result);
        })
    })

}


//电视剧
function setMySql(obj) {
    let query = `INSERT variety (pname,clarity,director,performer,releaseTime,city,type,language,updateTime,introduction,coverImg,path) 
                            VALUES('${toLiteral(obj.pname)}','${obj.clarity}','${toLiteral(obj.director)}','${toLiteral(obj.performer)}',
                                    '${obj.releaseTime}','${obj.city}','${obj.type}','${obj.language}','${obj.updateTime}',
                                    '${toLiteral(obj.introduction)}','${obj.coverImg}','${JSON.stringify(obj.path)}')`;
    querySql(query).then(data => {
        console.log(data);
    })
}


/** 获取视频源 */
//获取视频源
function getVideo(req, res, next) {
    if (validaErr(req)) {
        factorialMemo(54)


        res.json({
            code: CODE_SUCCESS,
            msg: '视频列表',
            data: ''
        })
    }
}

const factorialMemo = (function () {
    return function factorial(n) {
        if (n < 0 || n === 0) {
            console.log('结束');
            return
        } else {
            let url = `http://www.wbdy.tv/vodlist/id-3-pg-${n}-order--by--class-0-year-0-letter--area--lang-.html`;
            getApi(url).then(data => {
                if (data) {
                    factorial(n - 1)
                }
            })
        }
    }
})();

function getApi(url) {
    return new Promise((resolve, reject) => {
        request.get(url, async (error, response, body) => {
            const $ = cheerio.load(body);
            var array = $('.row.rowEx .colEx').map((i, ele) => {
                let href = 'http://www.wbdy.tv' + cheerio.load($(ele).html())('.textdis a').attr('href');
                let pname = cheerio.load($(ele).html())('.textdis a').text();
                return { pname: pname, href: href }

            }).get();


            fs.readFile(fileVideo, 'utf-8', (err, data) => {
                let arr = JSON.parse(data);

                var arr1 = [...arr, ...array];
                let arr2 = Array.from(new Set(arr1))


                console.log(arr2.length);
                fs.writeFile(fileVideo, JSON.stringify(arr2, null, 4), { encoding: 'utf8' }, err => {
                    if (err) throw err
                    console.log('文件已被写入')
                    resolve(true);
                })
            })

        })
    })

}


// 异步写入数据到文件




module.exports = {
    crawlVideo,
    getVideo
}