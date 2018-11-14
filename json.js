var express = require('express');
var app = express();
const fs = require('fs')
const path = require('path')
const port = 10000;
var data = [];
var index = 1
//模板引擎
app.set("view engine","ejs");
//静态服务
app.use(express.static("./public"));

// 读取本地json 文件
// function readJson (index) {
//     var file = path.join(__dirname, `alljson/${index}.json`); //文件路径，__dirname为当前运行js文件的目录
//     return new Promise((resolve, reject) => {
//         //读取json文件
//         fs.readFile(file, 'utf-8', function(err, data) {
//             if (err) {
//                 reject('文件读取失败');
//             } else {
//                 index ++
//                 resolve(data)
//             }
//         });
//     })
// }
// readJson(index).then((resolve)=>{
//     data = JSON.parse(resolve)
// })

function readJson (index) {
    var file = path.join(__dirname, `alljson/${index}.json`); //文件路径，__dirname为当前运行js文件的目录
    //读取json文件
    index++;
    let SyncJson = fs.readFileSync(file).toString();
    let sent_list = JSON.parse(SyncJson).sent_list;
    for (let item =0;item<sent_list.length;item++) {
        data.push(sent_list[item])
    }
    if( index < 136) {
        readJson(index)
    }
    fs.writeFile("./alljson.json",JSON.stringify(data),function(err){
        console.log(err)
    })
    // console.log(JSON.parse(SyncJson).sent_list[0].appmsg_info)
    // console.log(data)
}   
readJson(index)

app.get("/alljson", function (req,res,next) {
    res.send(data)
});

app.get('/', (req,res,next)=>{
	res.render('json.ejs')
})

app.listen(port, function(){
	console.log(`启动成功，端口${port}`)
});
