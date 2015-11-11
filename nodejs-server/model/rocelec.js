var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http');


getStore("http://www.digikey.com.cn/search/zh/0812005-ZXST/F4964-ND?recordId=2519872",function(data){
	console.log(data)
})

function  getStore(url,cb){
	http.get(url, function(res) {
	var bufferHelper = new BufferHelper();
	res.on('data', function(chunk) {
		bufferHelper.concat(chunk);
	});
	res.on('end', function() {
		var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(), 'UTF-8')); 

$('#pricingTable table').remove(); 
		$('#pricingTable tr').each(function(index,item){
		 	   if(index==2){
		 			cb($(item).text().replace('现有数量','').replace('得捷电子库存现货:','').replace('可立即发货','').trim())
		 	   }
		})
	});
});
}