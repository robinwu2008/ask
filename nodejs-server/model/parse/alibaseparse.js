var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http');


var yunlist = ["http://heiji001.aliapp.com", "http://heiji002.aliapp.com", "http://heiji003.aliapp.com"]


exports.readmsg = function(url, cb) { 
	var auth = 'Basic ' + new Buffer("31651179_default_-63:rbj6h57526").toString('base64'); // 这里用户名密码请查看“扩展服务”-> “网页代理”
	var options = {
		host: 'proxy.ace.aliyun.com', // 这里查看“扩展服务”-> “网页代理”中的“网页代理地址”
		port: 3128,
		method: "GET",
		path: url, // 这里填写你要请求的url
		headers: {
			"Proxy-Authorization": auth
				// Host: "taobao.com"                         
		}
	};
	var bufferHelper = new BufferHelper();
	require("http").get(options, function(res) { 
		res.on('data', function(chunk) {
			bufferHelper.concat(chunk);
		});
		res.on('end', function() {
			var html = iconv.decode(bufferHelper.toBuffer(), 'UTF-8');
			var $ = cheerio.load(html);
			console.log(url + "::::" + html.length)
			cb(html);
		});
	});  
}


exports.readmsgOld = function(url, cb) {
	try {
		http.get(url,
			function(res) {
				var bufferHelper = new BufferHelper();
				res.on('data',
					function(chunk) {
						bufferHelper.concat(chunk);
					});

				res.on('end',
					function() {
						var html = iconv.decode(bufferHelper.toBuffer(), 'UTF-8');
						var $ = cheerio.load(html);
						console.log(url + "::::" + html.length)
						cb(html);
					});
			});
	} catch (e) {
		console.log(e);
	}
}
exports.readmsgBycode = function(url, code, cb) {
var auth = 'Basic ' + new Buffer("31651179_default_-63:rbj6h57526").toString('base64'); // 这里用户名密码请查看“扩展服务”-> “网页代理”
	var options = {
		host: 'proxy.ace.aliyun.com', // 这里查看“扩展服务”-> “网页代理”中的“网页代理地址”
		port: 3128,
		method: "GET",
		path: url, // 这里填写你要请求的url
		headers: {
			"Proxy-Authorization": auth
				// Host: "taobao.com"                         
		}
	};
	var bufferHelper = new BufferHelper();
	require("http").get(options, function(res) { 
		res.on('data', function(chunk) {
			bufferHelper.concat(chunk);
		});
		res.on('end', function() {
			var html = iconv.decode(bufferHelper.toBuffer(), 'UTF-8');
			var $ = cheerio.load(html);
			console.log(url + "::::" + html.length)
			cb(html);
		});
	});  
}