//crawl_url_key
var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http')
var D = require('./zuaaDao');
var fs = require('fs')
var crypto = require('crypto');
var md5sum = crypto.createHash('md5');
var url = require('url'); 
var sizeOf = require('image-size');
var imgurl = "http://static.acfun.mm111.net/h/upload2/images/2014-06-17/7623c62d-55bb-40ef-a326-8ec221cd0dd2.jpg"
var filepath = "/temp/"
var options = url.parse(imgurl);

http.get(options, function(response) {
	var chunks = [];
	response.on('data', function(chunk) {
		chunks.push(chunk);
	}).on('end', function() {
		var buffer = Buffer.concat(chunks);
		var s = sizeOf(buffer);
		if (s.width > 400) {
			console.log(s);
			md5sum.update(imgurl);
			str = md5sum.digest('hex');
			filepath = "/temp/" + str + "." + s.type
			var data = {
				kid: str
			}
			D.find({
				"kid": data.kid
			}, "crawl_url_key", function(rows) {
				if (rows != undefined && rows.length > 0) {
					console.log("bu baocun")
				} else {
					D.insert(data, "crawl_url_key")
					console.log(data)
					http.get(imgurl, function(res) {
						var file = fs.createWriteStream(filepath);
						res.on('data', function(data) {
							file.write(data);
						}).on('end', function() {
							file.end();
							console.log('download success');
						});
					});
				}
			})
		} else {
			console.log("too small");
		}
	});
});