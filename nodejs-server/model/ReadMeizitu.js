 
var mysql = require('mysql');
var request = require('request'); 
var cheerio = require('cheerio');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');
var http = require('http')
var D = require('./zuaaDao'); 

exports.doit = function() {
	console.log("read:http://www.meizitu.com/") 
	readList("http://www.meizitu.com/")
}
 
exports.dourl = function(url) {
	console.log("read:"+url) 
	readList(url)
}
  
function readMessage(url){
	http.get(url,function(res){
		var bufferHelper = new BufferHelper();
		res.on('data', function (chunk) {
			bufferHelper.concat(chunk);
		});
		res.on('end',function(){  
		var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(),'GBK'));  
		var c=$("#picture").html();
		var t=$(".metaRight h2").text()
		// console.log(t) 
		savemessage({title:t,content:c,"artic":"meizitu","type_id":4,graburl:url})
		});
	})
}
function readList(url){
	http.get(url,function(res){
		var bufferHelper = new BufferHelper();
		res.on('data', function (chunk) {
			bufferHelper.concat(chunk);
		});
		res.on('end',function(){  
			var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(),'GBK'));  
			$(".picnew").find("a").each(function(){
				console.log($(this).attr("href")) 
				readMessage($(this).attr("href"))
			}) 
		});
	})
} 
function savemessage(data){
	D.find( {graburl:data.graburl},"cms_post",function(rows){
		console.log(rows.length)
		if(rows.length>0){
			console.log("bu baocun ") 
		}else{
			D.insert(data,"cms_post")  
		}
	})  
}