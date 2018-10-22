var express = require('express');
var app = express();
var request = require('request');
const fs = require('fs')
const port = 4000;

//模板引擎
app.set("view engine","ejs");
//静态服务
app.use(express.static("./public"));
// var url = 'http://www.runoob.com/nodejs/nodejs-express-framework.html'
// var url = 'https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token=524646189'
var count = 7;
var begin = 0;
var total_count = 0;
var url = 'https://mp.weixin.qq.com/cgi-bin/newmasssendpage?count='+ count + '&begin='+ begin +'&token=710333876&lang=zh_CN&token=710333876&lang=zh_CN&f=json&ajax=1'
var Cookie = 'noticeLoginFlag=1; remember_acct=13161282746%40163.com; pt2gguin=o1259709654; RK=H9hw2cUUQa; ptcz=ee5ce01bb90b7a12e21faed88ece6211923b0faedf451c827530fddf2c62f495; pgv_pvid=9742580992; tvfe_boss_uuid=4a8ff00d79686c79; o_cookie=1259709654; pgv_pvi=4011911168; sd_userid=78281537018665431; sd_cookie_crttime=1537018665431; ua_id=HGLFKCPbomddLjjIAAAAAKiVNk5GCFVKE1HPb8dZ9u0=; mm_lang=zh_CN; pgv_si=s6187456512; ticket=27ab92952bf571b95dc6f153ed7cf55d53133bc7; ticket_id=gh_a40af06d8326; uuid=26fb0dc722dc760cec5cd387890a3507; cert=x4vTSI73IsbuVyrOV5YmsdB1hBNQEYyA; data_bizuin=3214773579; bizuin=3203774296; data_ticket=sKzU6C5eoCjt6ZCbU9zFYYA0klH5DtybCiUzaMaGcl1vy0KHojPFj4/yRcv1LHBv; slave_sid=SzNvSThkbW5GRzNyZFFrcTNjQU1pRFhkbjNZQ1UwRFlTUmFjd3JqeE9wTVFCTTY4RnRGblQ4ZGx0SjVUWklWRFprN290Uk1jMmJkaXhndDJHRWcwN21ZVkFOdzRJSXBJSW9LcW03N2VjWmdHSDVxTzlvNWVHSUpmbVBzS2Ntb0hZM3F6Q20wMEUzM05LdVJ5; slave_user=gh_a40af06d8326; xid=f60eac21dd34b17c764d62018609ec58; openid2ticket_oS42dv2r9XY5OnDIjU4qYiXWXarc=/scOiHagDlyjrH+Z77Gr3DZw8DbjtFdUg9NgcD87wwM='
var Referer = 'https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token=710333876';
var Host = 'mp.weixin.qq.com';
// 爬虫数据页面
app.get("/spider", (req,res,next) => {
	var json = '';
	var sent_list = []
	function getPageData () {
		console.time('getRequest')
	    return	new Promise ((resolve, reject) => {
			function getRequest () {
				request({
					url:    url,   // 请求的URL
					method: 'GET',                   // 请求方法
					headers: {                       // 指定请求头
						'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',         // 指定 Accept-Language
						'Cookie': Cookie,
						'Referer': Referer,
						'Host': Host
					}
				},  (error, response, body) => {
					if (!error && response.statusCode == 200) {
						json = JSON.parse(body)
						sent_list.push(json.sent_list)
						if (begin <= total_count-7) {
							begin = begin + 7
							url = 'https://mp.weixin.qq.com/cgi-bin/newmasssendpage?count=7&begin='+ begin +'&token=710333876&lang=zh_CN&token=710333876&lang=zh_CN&f=json&ajax=1'
							getRequest()
						} else {
							begin = 0; // 递归结束后重置未0
							url = 'https://mp.weixin.qq.com/cgi-bin/newmasssendpage?count=7&begin='+ begin +'&token=710333876&lang=zh_CN&token=710333876&lang=zh_CN&f=json&ajax=1'
							console.log('递归结束');
							console.timeEnd('getRequest')
							handelData()
						}
						// console.log(sent_list)
					}
				})
			}
			getRequest()
			resolve(sent_list)
		})
	}

	function getTotalCount () {
	    return	new Promise ((resolve, reject) => {
			request({
				url:    url,   // 请求的URL
				method: 'GET',                   // 请求方法
				headers: {                       // 指定请求头
					'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',         // 指定 Accept-Language
					'Cookie': Cookie,
					'Referer': Referer,
					'Host': Host
				}
			},  (error, response, body) => {
				if (!error && response.statusCode == 200) {
					json = JSON.parse(body)
					total_count = json.total_count
					resolve(total_count)
				}
			})
		})
	}

	function handelData () {
		var pageArr = [];
		var dataArr = [];
		for (let n =0; n<sent_list.length; n++) {
			dataArr.push(sent_list[n])
		}

		for(var i = 0; i<dataArr.length;i++) {
			for (var j =0;j<dataArr[i].length;j++) {
				pageArr.push(dataArr[i][j].appmsg_info[0])
			}
		}
		
		res.render("spider",{
			"json":pageArr,
			'total_count': total_count
		});
	}

	getTotalCount().then(()=> {
		getPageData()
	}).then(()=>{
		console.log(2)
	})
});

app.listen(port, function(){
	console.log(`启动成功，端口${port}`)
});
