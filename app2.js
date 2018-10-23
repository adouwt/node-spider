var express = require('express');
var app = express();
var request = require('request');
const fs = require('fs')
const port = 5000;

//模板引擎
app.set("view engine","ejs");
//静态服务
app.use(express.static("./public"));
var count = 7;
var begin = 0;
var total_count = 0;
var url = 'https://mp.weixin.qq.com/misc/appmsganalysis?action=report&type=daily&begin_date=2018-09-11&end_date=2018-10-11&token=1910526575&lang=zh_CN&f=json&ajax=1&random=0.12425873553062639'
var Cookie = 'pgv_pvid=547304586; pgv_pvi=2822305792; pt2gguin=o1259709654; RK=s9g428U1EY; ptcz=aa91ce1d089eb6d39c2683d527eb1d088f327623f363486ad0996d1c2b7683f4; luin=o1259709654; lskey=0001000035ad913a00f70d852fd9194d25e9812369a22574283648da4ec82dbefa013988f89058cf11b9e8b0; o_cookie=1259709654; pac_uid=1_1259709654; ua_id=fnrJSr2vdY47HsFuAAAAALLgirZigbVd_k9zOuhD80Q=; mm_lang=zh_CN; dm_login_weixin_rem=; logout_page=dm_loginpage; dm_login_weixin_scan=; pgv_si=s1045404672; uuid=afd42e17a8172ebe3766c510281265ae; ticket=3b41a6b9e36ea0ae79ae6c0b2cc60e8d43b69e12; ticket_id=gh_a40af06d8326; cert=X49Ct6q0T1278sSxJMI_spIoDmHWQonO; data_bizuin=3214773579; bizuin=3203774296; data_ticket=uQelJX7a5xGMz9KlyVkLy/FCjAJuTwHZ3b71I8Si5/btfBwi6pPAHZi8NhQZFFx5; slave_sid=YWRvSndwNUFNMEhmTzdxMWNRRFJwblJmam5iazFEOERpWG5MT3kzVk5GWDlaWlhBUmJnRlNVUGFFQ0xCandnVDNHZkdzQkdjSW1fdk1YdWdMQVRSTXc0eWtpSEprS1JHaDBhOTRLWmlJMzJzWEtveENNVHVMQUowSlVGUGRNU3hLdGZjSktYSVNRZm1FbFFi; slave_user=gh_a40af06d8326; xid=dcd43a1c40e4f4f15f564d3a7ef25321; openid2ticket_oS42dv2r9XY5OnDIjU4qYiXWXarc=uufC10RUAaUWSVkAE+nrkwy4JsaNcwFOAl/VKEyJKTg='
var Referer = 'https://mp.weixin.qq.com/misc/appmsganalysis?action=report&token=1910526575&lang=zh_CN';
var Host = 'mp.weixin.qq.com';

// 爬虫数据页面
app.get("/app2", (req,res,next) => {
	var json = '';
	var sent_list = [];
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
						// sent_list.push(json.sent_list)
						// if (begin <= total_count-7) {
						// 	begin = begin + 7
						// 	url = 'https://mp.weixin.qq.com/cgi-bin/newmasssendpage?count=7&begin='+ begin +'&token=536967187&lang=zh_CN&token=536967187&lang=zh_CN&f=json&ajax=1'
						// 	getRequest()
						// } else {
						// 	begin = 0; // 递归结束后重置未0
						// 	url = 'https://mp.weixin.qq.com/cgi-bin/newmasssendpage?count=7&begin='+ begin +'&token=536967187&lang=zh_CN&token=536967187&lang=zh_CN&f=json&ajax=1'
						// 	console.log('递归结束');
						// 	console.timeEnd('getRequest')
						// 	handelData()
                        // }
                        fs.writeFile("./app2.txt",body,function(err){
                            console.log(err)
                        })
						console.log(json)
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

app.get('/page-app2', (req,res,next)=>{
	res.render('spider2')
})
app.listen(port, () => {
	console.log(`启动成功，端口${port}`)
});
