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
var url = 'https://mp.weixin.qq.com/cgi-bin/newmasssendpage?count='+ count + '&begin='+ begin +'&token=142528939&lang=zh_CN&token=142528939&lang=zh_CN&f=json&ajax=1'
var Cookie = 'noticeLoginFlag=1; remember_acct=13161282746%40163.com; pt2gguin=o1259709654; RK=H9hw2cUUQa; ptcz=ee5ce01bb90b7a12e21faed88ece6211923b0faedf451c827530fddf2c62f495; pgv_pvid=9742580992; tvfe_boss_uuid=4a8ff00d79686c79; o_cookie=1259709654; pgv_pvi=4011911168; sd_userid=78281537018665431; sd_cookie_crttime=1537018665431; ua_id=HGLFKCPbomddLjjIAAAAAKiVNk5GCFVKE1HPb8dZ9u0=; mm_lang=zh_CN; pgv_si=s831066112; ticket_id=gh_a40af06d8326; cert=9ZdJOl0CLJMrqOLncg6JLs8glmSkYg9f; rewardsn=; wxtokenkey=777; uuid=44496e25ca95c21ec1067a3472d0e26c; ticket=d56a31d79fa2503091c375455006e6a0a798f4c8; data_bizuin=3214773579; bizuin=3203774296; data_ticket=oB/5x51k/ej7ToMkxHz9mXlsPI3B2UhvqLfWysZPZqZFiP6kSUbQs0oRu1/BtJHq; slave_sid=Q0tfU0JYaFdFeV9HYmVSSVdnYUxhVHdOTE16OThtR1ZDWGRqdmNkZmZGNV9QbkFBOWlOYmtzYVRWM2ZVR2FycjQzNTB0cklTa1JCQWpPdmtMVFA0V2IzNnkzNWd2ZEdiRllvRUgxQmpCM1Ntd0dGUlUxaHYydjNkT3dvRXBLRk9lSDlzTUNIWGMyUThqOGFP; slave_user=gh_a40af06d8326; xid=80c9bce84469014d83f4ee6558887da6; openid2ticket_oS42dv2r9XY5OnDIjU4qYiXWXarc=Vp4AHQP6W5bCxQZAm9/GfjKUolLpj3PAojN7QD/kxeg='
var Referer = 'https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token=142528939';
var Host = 'mp.weixin.qq.com';
// 爬虫数据页面
app.get("/spider",function (req,res,next) {
	var json = '';
	request({
		url:    url,   // 请求的URL
		method: 'GET',                   // 请求方法
		headers: {                       // 指定请求头
			'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',         // 指定 Accept-Language
			'Cookie': Cookie,
			'Referer': Referer,
			'Host': Host
		}
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// console.log(body)
			fs.writeFile("./data.txt",body,function(err){
				console.log(err)
			})
			json = JSON.parse(body)
			total_count = json.total_count
		}
	})
	
	setTimeout(function(){
		var total_count = json.total_count
		var dataArr = json.sent_list
		// var arr = JSON.parse(dataArr)
		var pageArr = []
		for(var i = 0; i<dataArr.length;i++) {
			pageArr.push(dataArr[i].appmsg_info[0])
		}
		res.render("spider",{
			"json":pageArr,
			'total_count': total_count
		});
	},2000)
});

app.listen(port, function(){
	console.log(`启动成功，端口${port}`)
});
