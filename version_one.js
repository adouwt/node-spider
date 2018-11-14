var express = require('express');
var app = express();
var request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const fs = require('fs')
const port = 4000;

//模板引擎
app.set("view engine","ejs");
//静态服务
app.use(express.static("./public"));
// var url = 'http://www.runoob.com/nodejs/nodejs-express-framework.html'
var url = 'https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token=524646189'

// 爬虫数据页面

app.get("/spider",function (req,res,next) {
	var json = '';
	request({
		url:    url,   // 请求的URL
		method: 'GET',                   // 请求方法
		headers: {                       // 指定请求头
			'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',         // 指定 Accept-Language
			'Cookie': 'noticeLoginFlag=1; remember_acct=13161282746%40163.com; pt2gguin=o1259709654; RK=H9hw2cUUQa; ptcz=ee5ce01bb90b7a12e21faed88ece6211923b0faedf451c827530fddf2c62f495; pgv_pvid=9742580992; tvfe_boss_uuid=4a8ff00d79686c79; o_cookie=1259709654; pgv_pvi=4011911168; sd_userid=78281537018665431; sd_cookie_crttime=1537018665431; ua_id=HGLFKCPbomddLjjIAAAAAKiVNk5GCFVKE1HPb8dZ9u0=; mm_lang=zh_CN; pgv_si=s831066112; uuid=c1aa516e03040f36c3f8b492929ea270; ticket=cc4a6b3327aec3fe14a9918287201810e9eea9a2; ticket_id=gh_a40af06d8326; cert=9ZdJOl0CLJMrqOLncg6JLs8glmSkYg9f; data_bizuin=3214773579; bizuin=3203774296; data_ticket=f6SF7xfLpMVOArpby16dftvdaOAM3eOL+9caTcidEfnFcBGJPSH76bna56UITfxn; slave_sid=M0JsM0FkS3R5bHFuSDgxZWp0U0xvOXFRZWtRT2JrQ25OaEVWWDN6WHJ0QmpIc2NkWEREZGZmZjFnQnVqOThrMF9PaDdfWnd5OFhXRjh2NExXV19Cenl1UkMzdzV4RW92Mmt1cGRBVm1lZXlhS3BQRk9QclI0V24wc2RmWjd3elFIa2VLaWY2dEcxOTRZd21u; slave_user=gh_a40af06d8326; xid=b4f58152d40cb7e2521c81e30ec7ef4b; openid2ticket_oS42dv2r9XY5OnDIjU4qYiXWXarc=RIeeT3jLurPNKcNigZUmJSAZsDvndqvXG9DOx6P+KVU=', // 指定 Cookie
			'Referer': ' https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token=524646189',
			'Host': 'mp.weixin.qq.com'
		}
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(body);
			console.log(body)
			fs.writeFile(`./body-${new Date()}.txt`,body,function(err){
				console.log(err)
			})
			var a_arr =	$('.weui-desktop-mass-media__data__inner');
			var href = []
			a_arr.each(function(i){
				href.push({'views': $(this).attr('href')})
			})
			json = body
			console.log(href)
		}
	})
	setTimeout(function(){
		console.log(typeof(json))
		json.replace(/\t\r\n/g, '')
		res.render("spider",{
			"json":json
		});
	},4000)
});

app.listen(port, function(){
	console.log(`启动成功，端口${port}`)
});
