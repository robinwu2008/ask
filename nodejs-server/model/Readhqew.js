 var mysql = require('mysql');
 var request = require('request');
 var cheerio = require('cheerio');
 var iconv = require('iconv-lite');
 var BufferHelper = require('bufferhelper');
 var http = require('http')
 var async = require('async')
 var D = require('./zuaaDao');



///////////////
 var url = "http://www.hqew.com/tech/fangan.html"
 readList(url)


/////////////////////
 function readMes(url) {
 	try {
 		http.get(url, function(res) {
 			var bufferHelper = new BufferHelper();
 			res.on('data', function(chunk) {
 				bufferHelper.concat(chunk);
 			});
 			res.on('end', function() {
 				var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(), 'utf-8'));
 				title = $(".g-fz-16").text()
 				content = $(".content ").html()
 				if (title.length>0) {
 					D.insert({
 						title: title,
 						content: content,
 						graburl: url
 					}, "cms_post_ic");
 				}

 			});
 		})
 	} catch (e) {

 	}
 }

 function readList(url) {
 	try {
 		http.get(url, function(res) {
 			var bufferHelper = new BufferHelper();
 			res.on('data', function(chunk) {
 				bufferHelper.concat(chunk);
 			});
 			res.on('end', function() {
 				var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(), 'utf-8'));
 				$(".g-lh-22").find("a").each(function(index, item) {
 					try {
 						readMes("http://www.hqew.com/" + $(this).attr("href"))
 					} catch (e) {}
 				})
 			});
 		})
 	} catch (e) {

 	}

 }