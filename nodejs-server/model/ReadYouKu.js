 
var mysql = require('mysql');
var request = require('request'); 
var cheerio = require('cheerio');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');
var http = require('http')

var D = require('./zuaaDao'); 

exports.doit = function() {
	readList("http://caodan.org/")
}
 
 
function readMessage(url){
	http.get(url,function(res){
		var bufferHelper = new BufferHelper();
		res.on('data', function (chunk) {
			bufferHelper.concat(chunk);
		});
		res.on('end',function(){  
		var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(),'UTF-8'));  
		var c=$(".entry-content").html();
		var t=$(".entry-title").text()
		// console.log(t) 
		savemessage({title:t,content:c,"artic":"meizitu","type_id":2,graburl:url})
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
			var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(),'UTF-8'));  
			$(".entry-title").find("a").each(function(){
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