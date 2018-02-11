var express = require('express');
var app = express();
var path = require('path')
var fs = require('fs')
var crypto = require('crypto');

var bodyParser = require('body-parser')
app.use(express.static(path.resolve('./'))) 
var multipart = require('connect-multiparty');  
var multipartMiddleware = multipart();  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//连接数据库
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database:'h5edit',
    port: 3306
});
conn.connect();
// conn.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//     if (err) throw err;
//     console.log('The solution is: ', rows[0].solution);
// });
// conn.end();

app.get('/', function (req, res) {
	res.header('Access-Control-Allow-Origin', '*')
  	res.sendfile(path.resolve('./index.html'))
});
app.get('/save',function(req,res){
	res.header('Access-Control-Allow-Origin', '*')
	conn.query('insert into edit_data set ?', {source:req.body.editData}, function(err, result) {
		if (err) throw err
		console.log('inserted success')
		// res.send('插入成功')
		res.sendfile(path.resolve('./index.html'))
	})
	// conn.end()

})
app.post('/saveData',multipartMiddleware,function(req,res){
	res.header('Access-Control-Allow-Origin', '*');  
	console.log(req.body.data)
	conn.query('insert into edit_data set ?', {source:req.body.data}, function(err, result) {
		if (err) throw err
		console.log('save success')
		res.json(result)
	})
})
app.get('/getData',function(req,res){
	var type = req.query.type
	if(type=='save'){
		var query = ' select * from edit_data order by  id desc limit 1'
	}else if(type='preview'){
		var id =  req.query.id
		var query = 'select * from edit_data where id='+id
	}
	conn.query(query, function(err, result) {
	    if (err) throw err
	    res.json(result[result.length-1].source)
	})
	// conn.end()
})
app.get('/getCurrentData',function(req,res){
	var id =  req.query.id	
	conn.query('select * from edit_data where id='+id, function(err, result) {
	    if (err) throw err
	    res.json(result[result.length-1].source)
	})
	// conn.end()
})
app.get('/preview',function(req,res){
	res.header('Access-Control-Allow-Origin', '*')
	var id =  req.query.id
	conn.query('select * from edit_data where id='+id, function(err, result) {
		if (err) throw err
		console.log('select success')
		// res.send('插入成功')
		res.sendfile(path.resolve('./index.html'))
	})
	// conn.end()
})
app.post('/upload', multipartMiddleware,function(req, res){
	res.header('Access-Control-Allow-Origin', '*');  
  
  
	// res.json({result: 'success', data: req.body}); 
  // console.log(req.files)
	// res.send('hello world')
	//接收前台POST过来的base64
	// var imgData = req.body.imgData
	// console.log(req.body)
	//过滤data:URL
	// var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "")
	// var dataBuffer = new Buffer(imgData, 'base64')
	// fs.writeFile("image.png", imgData, function(err) {
	//     if(err){
	//       res.send(err)
	//     }else{
	//       res.send(imgData)
	//     JSON.stringify(req.files)
	// })
	// console.log(JSON.stringify(req.files))
	fs.readFile(req.files.imgData.path, function (err, data) {
		var md5 = crypto.createHash('md5');
	        var newPath = md5.update(data).digest('hex');
	        console.log(newPath)
	        fs.writeFile('data/'+newPath+'.png', data, function (err) {
	          res.send('data/'+newPath+'.png');
	        });
	 });
	// var form = new multiparty.Form();
	//     form.parse(req, function (err, fields, files) {
	//        console.log(fields);
	//     });
	// console.log(req.files)
})

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});