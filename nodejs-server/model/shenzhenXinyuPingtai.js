var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http')
var async = require('async')
var D = require('./zuaaDao');
var url = require('url');
var querystring = require("querystring");
var needle = require('needle');
var session = ""
var fs = require('fs')
var options = {
	headers: {
		'X-Custom-Header': 'Bumbaway atuna'
	}
}
var imgurl = "http://www.szcredit.com.cn/web/WebPages/Member/CheckCode.aspx"
var filepath = "/temp/code.jpg"


var options = url.parse(imgurl);
options.headers = {
	'Content-Type': 'application/x-www-form-urlencoded'
}
http.get(options, function(res) {
	var file = fs.createWriteStream(filepath);
	res.on('data', function(data) {
		file.write(data);
		session = res.headers["set-cookie"][0];
		//console.log(session);
	}).on('end', function() {
		file.end();
		var options1 = {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Accept-Language": "zh-cn",
				"Cache-Control": "no-cache",
				"Connection": "Keep-Alive",
				"Host": "www.szcredit.com.cn",
				"Referer": "http://www.szcredit.com.cn",
				"User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)",
				"X-Requested-With": "XMLHttpRequest",
				"Cookie": session
			}
		}

		var post_data = querystring.stringify({
			flag: 0,
			type: 1,
			chkval: "eh4k",
			txtNameKey: "家具"
		});
		needle.post("http://www.szcredit.com.cn/web/WebPages/Search/SZSEntList.aspx", post_data, options, function(err, resp) {

			console.log(resp.body)
		});
	});
});