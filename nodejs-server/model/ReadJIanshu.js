/**
 *
 * User: zu
 * Date: 14-9-11
 * Time: 上午10:59
 *
 */
var request = require('request'); 
var cheerio = require('cheerio');
var events=require("events");
var mysql = require('mysql');
var crawler=new events.EventEmitter(); 
///////////////////////////////////////////
var pool = mysql.createPool( {
    host: 'rds3qmfin3qmfin.mysql.rds.aliyuncs.com',
    user: 'db24z2f7wjl7cpfj',
    password: 'aaaaaaaa',
    database:'db24z2f7wjl7cpfj',
    port: 3306,
	connectionLimit: 10,
    supportBigNumbers: true
}); 
///////////////////////////////////////////////////////////////////
crawler.addListener("findList",findList); 
crawler.addListener("readMessage",readMessage);
crawler.addListener("findNewList",findNewList); 
////////////////////////////////////////////////////////////////////// 
getSeed()
 
//readMessage("http://www.jianshu.com/p/5c6be71f8366")


//种子存在数据库,连接数据库，获取种子连接。
function findList(graburl){
	request(graburl, function(error, response, html) {
		if (!error && response.statusCode == 200) {  
			   var $ = cheerio.load(html); 
			   //发现详情
			   console.log("发现详情") 
			   $('.top-notes h4 a').each(function(index,item){ 
					crawler.emit('readMessage',"http://www.jianshu.com"+$(this).attr("href"));
				}) 
		}else{
			console.log("error")
		} 
	});  
}


 function readMessage(graburl){
	pool.getConnection(function (err, conn) { 
		conn.query("SELECT count(1) as num  from cms_post where graburl ='"+graburl+"'", function(err, rows, fields) {
			if (err) throw err;
			conn.release(); 
			console.log(rows[0].num ); 
			 if(rows[0].num>0){
			 	console.log(rows[0].num+"已经有了");  
			 }else{
			 	//抓数据存数据
			 	//crawler.emit('findList',rows[0].graburl); 
			 	request(graburl, function(error, response, html) {
					if (!error && response.statusCode == 200) {  
						var $ = cheerio.load(html); 
						//发现详情
						console.log("发现详情") 
						title= $('h1').text()
						content=$(".show-content").html()
						author=$(".author").text()
						pool.getConnection(function (err, conn) {
							conn.query('INSERT INTO  cms_post (title,content,graburl,artic) values  (?,?,?,?)   ',
							  [title,content, graburl,author],function(data){ 
								conn.release();
							});
						});
					}else{
						console.log("error")
					} 
				});  
			 } 
		});
	}); 
}

function findNewList(url){
	 
}

function getSeed(){
	pool.getConnection(function (err, conn) { 
		conn.query('SELECT graburl  from crawl_list where state =1 limit 0,1  ', function(err, rows, fields) {
			if (err) throw err;
			conn.release();
			 if(rows[0]){
			 	console.log(rows[0].graburl);
			 	crawler.emit('findList',rows[0].graburl); 
			 }else{
			 	console.log("nothing to do");
			 } 
		});
	});
}


//获取list上的文章连接，逐一分析，保存。

//发现列表页面，就将url保存到数据库






















 