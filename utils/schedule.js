/**
 * @描述：定时器
 * @作者: mzz
 * @日期: 2021-01-20 23:53:26
 * @更新日期：2021-01-20 23:53:26
 */

const schedule = require('node-schedule');
const { crawlVideo } = require('../services/crawlingService')

const scheduleCronstyle = () => {
  //每分钟的第30秒定时执行一次:
  schedule.scheduleJob('00 0 * * * *', () => {
    console.log('scheduleCronstyle:' + new Date());
  });
}

scheduleCronstyle();
// crawlVideo();



//每分钟的第30秒触发： '30 * * * * *'
//每小时的1分30秒触发 ：'30 1 * * * *'
//每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
//每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
//2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'
//每周1的1点1分30秒触发 ：'30 1 1 * * 1'
