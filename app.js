/**
 * 描述: 入口文件
 * 作者: Jack Chen
 * 日期: 2020-06-12
*/

const bodyParser = require('body-parser'); // 引入body-parser模块
const express = require('express'); // 引入express模块
const cors = require('cors'); // 引入cors模块
const routes = require('./routes'); //导入自定义路由文件，创建模块化路由
// const cookieParser = require('cookie-parser')
const app = express();

app.use(bodyParser.json()); // 解析json数据格式
app.use(bodyParser.urlencoded({ extended: true })); // 解析form表单提交的数据application/x-www-form-urlencoded
app.use(cors()); // 注入cors模块解决跨域
// app.use(cookieParser())



// app.all('*', function (req, res, next) {
// 	res.header("Access-Control-Allow-Origin", req.headers.origin); //需要显示设置来源，不能使用‘*’
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
// 	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
// 	res.header("Access-Control-Allow-Credentials", true); //需要加上这个
// 	next();
// });


app.use('/', routes);

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => { // 监听8088端口
	console.log(`❗❗❗ Server is running at http://${hostname}:${port}/`)
})