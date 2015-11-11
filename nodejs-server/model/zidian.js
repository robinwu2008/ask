var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http');


read("12323",function(data){console.log(data)})
 
 function read(i,cb){
 var url = "http://xh.5156edu.com/html3/"+i+".html" 
	http.get(url, function(res) {
		var bufferHelper = new BufferHelper();
		res.on('data', function(chunk) {
			bufferHelper.concat(chunk);
		});
		var re={}
		res.on('end', function() {
		var html=iconv.decode(bufferHelper.toBuffer(), 'gb2312');
			var $ = cheerio.load(html);  
			re.name=$('.font_22').text();
			$('.font_14 script').remove()
			
			re.pinyin=$('.font_14').text();
			re.bihua=$('.table4').eq(4).text(); 
			re.bushu=$('.table4').eq(6).text(); 
			re.wubi=$('.table4').eq(8).text(); 
			re.jieshi=$('.font_18').html(); 
			cb(re)
		});
	}); 
}  