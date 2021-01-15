/**
 * @描述：爬取数据服务
 * @作者: mzz
 * @日期: 2021-01-12 22:11:11
 * @更新日期：2021-01-12 22:11:11
 */

let request = require('request');
let cheerio = require('cheerio');
const { querySql, queryOne, validaErr } = require('../utils/index');
const { CODE_ERROR, CODE_SUCCESS } = require('../utils/constant');

function crawlVideo(req, res, next) {
    if (validaErr(req)) {
        request.get('http://m.kuaikan66.com/Action/', function (error, response, body) {
            const $ = cheerio.load(body);
            $('#vod_list #content li').each((index, ele) => {
                const $li = cheerio.load($(ele).html());
                let href = 'http://m.kuaikan66.com' + $li('h2 a').attr('href');
                crawlVideoDetails(href)
            })
        })

        res.json({
            code: CODE_SUCCESS,
            msg: '视频列表',
            data: '200'
        })
    }
}

function crawlVideoDetails(href) {

    request.get(href, async (error, response, body) => {
        const $ = cheerio.load(body);
        //封面
        let coverImg = $('#resize_vod .vod-l .vod-n-img a img').attr('data-original');
        //名称
        let pname = $('#resize_vod .vod-n-l h1').text().trim();
        //清晰度
        let clarity = $('#resize_vod .vod-n-l .clear.fn-left').text().trim();
        //主演
        let performer = $('#resize_vod .vod-n-l .vw100.clear').text().trim();
        //类型
        let type = $('#resize_vod .vod-n-l .vw100.fn-left').text().trim();
        //导演
        let director = $('#resize_vod .vod-n-l .vw50.fn-left').eq(0).text().trim();
        //年份
        let releaseTime = $('#resize_vod .vod-n-l .vw50.yc.fn-right').eq(0).text().trim();
        //语言
        let language = $('#resize_vod .vod-n-l .vw50.yc.fn-left').text().trim();
        //地区
        let city = $('#resize_vod .vod-n-l .vw50.yc.fn-right').eq(-1).text().trim();
        //更新时间
        let updateTime = $('#resize_vod .vod-n-l .vw100').eq(-1).text().trim();
        //简介
        let introduction = $('#con_vod_2 .vod_content').text().trim();
        let objs = {
            pname: pname,
            coverImg: coverImg,
            clarity: clarity.replace('清晰：', ''),
            performer: performer.replace('主演：', ''),
            type: type.replace('类型：', ''),
            director: director.replace('导演：', ''),
            releaseTime: releaseTime.replace('年份：', ''),
            language: language.replace('语言：', ''),
            city: city.replace('地区：', ''),
            updateTime: updateTime.replace('更新：', ''),
            introduction: introduction
        }
        const source = [];
        $('#con_vod_1 .play-title span').each((index, ele) => {
            if ($(ele).attr('class') != 'playyuan') {
                source.push({ name: $(ele).text(), type: $(ele).attr('id') })
            }
        })
        $('#con_vod_1 .play-box').each((index, ele) => {
            let $href = cheerio.load($(ele).html());
            source[index].data = [];
            $href('a').each((index2, hele) => {
                source[index].data.push({ pname: $href(hele).text(), path: 'http://m.kuaikan66.com' + $href(hele).attr('href') });
            })
        })
        for (let i = 0; i < source.length;) {
            for (let j = 0; j < source[i].data.length;) {
                await crawlVideoPath(source[i].data[j].path).then(res => {
                    source[i].data[j].path = res.path;
                    source[i].player = res.player;
                    j++;
                })
            }
            i++;
        }
        objs.source = source;
        console.log(objs);


    })

    function crawlVideoPath(url) {
        return new Promise((resolve, reject) => {
            request.get({ url: url, headers: { 'referer': 'http://m.kuaikan66.com/' } }, (error, response, body) => {
                const $ = cheerio.load(body);
                let script = $('#zanpiancms_player script').html().replace('"', '').replace(/[\\]/g, '')
                let apiurl = script.substring(script.indexOf('"apiurl":"') + 10, script.indexOf('","adtime"'))
                let url = script.substring(script.indexOf(',"url":"') + 8, script.indexOf('","next"'))
                getIframe(apiurl + url).then(res => {
                    resolve(res);
                })
            })
        })

    }

    function getIframe(URL) {
        return new Promise((resolve, reject) => {
            request.get({ url: URL, headers: { 'referer': 'http://m.kuaikan66.com/' } }, (error, response, body) => {
                const $ = cheerio.load(body);
                let script = $('script').eq(3).html();
                let text = script.substring(script.indexOf('$.post("api.php", {') + 20, script.indexOf('}, function(data) {'));
                let array = text.replace(/\s*/g, '').replace(/["]/g, '').split(',')
                let url = array[0].replace('url:', '');
                let time = array[1].replace('time:', '');
                let key = array[2].replace('key:', '');

                apiLondidi(url, time, key).then(res => {
                    resolve(res);
                })
            })
        })

        function apiLondidi(url, time, key) {
            return new Promise((resolve, reject) => {
                let URL = 'https://api.longdidi.top/parse/api.php';
                var formData = { url: url, time: time, key: key }
                request.post({ url: URL, formData: formData }, (error, response, body) => {
                    let array = body.replace(/[" { }\\]/g, '').replace('url:', '').replace('player:', '').split(',')
                    let obj = { path: array[1], player: array[2] }
                    resolve(obj);
                })
            })
        }

    }

}







module.exports = {
    crawlVideo
}