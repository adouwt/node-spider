var express = require('express');
var app = express();
var request = require('request');
const fs = require('fs')
const port = 4000;

//模板引擎
app.set("view engine","ejs");
//静态服务
app.use(express.static("./public"));
var count = 7;
var begin = 0;
var total_count = 0;
var url = 'https://mp.weixin.qq.com/cgi-bin/newmasssendpage?count='+ count + '&begin='+ begin +'&token=536967187&lang=zh_CN&token=536967187&lang=zh_CN&f=json&ajax=1'
var Cookie = 'noticeLoginFlag=1; pgv_pvid=547304586; pgv_pvi=2822305792; pt2gguin=o1259709654; RK=s9g428U1EY; ptcz=aa91ce1d089eb6d39c2683d527eb1d088f327623f363486ad0996d1c2b7683f4; luin=o1259709654; lskey=0001000035ad913a00f70d852fd9194d25e9812369a22574283648da4ec82dbefa013988f89058cf11b9e8b0; o_cookie=1259709654; pac_uid=1_1259709654; dm_login_weixin_scan=; ua_id=fnrJSr2vdY47HsFuAAAAALLgirZigbVd_k9zOuhD80Q=; mm_lang=zh_CN; pgv_si=s8771505152; uuid=285c32227cd173be7c7f7e9966ad6654; ticket=70148fdf4748e618d0b8d57aabcf21e6e1bcddf9; ticket_id=gh_a40af06d8326; cert=p4aI2ByhKpzP1p00UctUNtfakcYTHQmW; data_bizuin=3214773579; bizuin=3203774296; data_ticket=TB9UVChprSsw8FmYBVeXVnxrSKdg+/AxQ6o1FI6S2NFqpN9E9RL3XTXSqBV8y4vp; slave_sid=b2lUNU81Tkw0MTVvdWRSN09TQTcwMkhoOVREQ2VJYzRyc3pldFRYM0NZaVZCYjROaVIzdFhKY3pnYVBhWmVfOGxiNzFBWXlxRG81Vjd3ZUQ4eEtPanJQd1FLdTZhWVdJaGE5QjFFM1ZOX3JLMzFiakVmZ2xkZWtuTHd0VDE0dFg1ZnBldlFOTnZ6bzk4MmtS; slave_user=gh_a40af06d8326; xid=d3322fdd0dce26f11be751e3b095c17b; openid2ticket_oS42dv2r9XY5OnDIjU4qYiXWXarc=6tr6kTeiroTXqGwkoaCMGEve6PPivkcbHTHLbdd7LcY='
var Referer = 'https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token=536967187';
var Host = 'mp.weixin.qq.com';
// 爬虫数据页面
app.get("/spiderJson", (req,res,next) => {
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
							url = 'https://mp.weixin.qq.com/cgi-bin/newmasssendpage?count=7&begin='+ begin +'&token=536967187&lang=zh_CN&token=536967187&lang=zh_CN&f=json&ajax=1'
							getRequest()
						} else {
							begin = 0; // 递归结束后重置未0
							url = 'https://mp.weixin.qq.com/cgi-bin/newmasssendpage?count=7&begin='+ begin +'&token=536967187&lang=zh_CN&token=536967187&lang=zh_CN&f=json&ajax=1'
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

		if (dataArr.length>0){
			for(var i = 0; i<dataArr.length;i++) {
				for (var j =0;j<dataArr[i].length;j++) {
					pageArr.push(dataArr[i][j].appmsg_info[0])
				}
			}
		}
		
		// res.render("spider",{
		// 	"json":pageArr,
		// 	'total_count': total_count
		// });
		var article = {
			"pageArr":pageArr,
			'total_count': total_count
		}
		res.json(article)
	}

	getTotalCount().then(()=> {
		getPageData()
	}).then(()=>{
		console.log(2)
	})
});

app.get('/', (req,res,next)=>{
	res.render('spider')
})
app.listen(port, () => {
	console.log(`启动成功，端口${port}`)
});
