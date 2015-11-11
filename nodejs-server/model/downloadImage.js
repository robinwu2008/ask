/**
 * 过滤内容的中图片，下载下来。
 */
var D = require('./zuaaDao');
var cheerio = require('cheerio');
var http = require('http')

var url = require('url');
var sizeOf = require('image-size');
var crypto = require('crypto');
var fs = require('fs')

for (var i = 600; i < 700; i++) {
	try {
		dealImage(i);
	} catch (e) {
		//TODO handle the exception
	}
}

function dealImage(id) {
	D.find({
		id: id
	}, "cms_post", function(rows) {
		if (rows != undefined && rows.length > 0) {
			//console.log(rows) 
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].content != undefined) {
					var $ = cheerio.load(rows[i].content);
					var c = rows[i].content;
					$("img").each(function(index, item) {
						download($(item).attr("src"))
					})
				}
			}

		}
	});

}



function download(imgurl) {
	checkImage(imgurl, function(s) {
		console.log(s);
		console.log(imgurl)
		imgurl = imgurl.toString()
		var filepath = "/Inetpub/resouse/img/site.weeego.cn/"
		var md5sum = crypto.createHash('md5');
		md5sum.update(imgurl.toString());
		str = md5sum.digest('hex');
		filepath = filepath + str + "." + s.type
		if (s.width > 100) {

		}
		var data = {
			kid: str,
			src: imgurl,
			url: "http://img.weeego.cn/img/site.weeego.cn/" + str + "." + s.type,
			width: s.width,
			height: s.height,
			type: s.type,
			state: s.width > 100 ? 1 : 0
		}
		D.find({
			"kid": data.kid
		}, "crawl_url_key", function(rows) {
			if (rows != undefined && rows.length > 0) {
				console.log("bu baocun")
			} else {
				D.insert(data, "crawl_url_key");
				saveimage(imgurl, filepath)
			}
		})
	})

}

function checkImage(imgurl, cb) {
	var options = url.parse(imgurl);
	options.headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
	http.get(options, function(response) {
		var chunks = [];
		response.on('data', function(chunk) {
			chunks.push(chunk);
		}).on('end', function() {
			var buffer = Buffer.concat(chunks);
			var s = sizeOf(buffer);
			//			if (s.width > 100) {
			cb(s);
			//			} else {
			//				console.log("too small");
			//			}
		});
	});
}

function saveimage(imgurl, filepath) {
	try {
		var options = url.parse(imgurl);
		options.headers = {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
		http.get(options, function(res) {
			var file = fs.createWriteStream(filepath);
			res.on('data', function(data) {
				//console.log("保存文件：" + data)
				file.write(data);
			}).on('end', function() {
				file.end();
				console.log('download success');
			});
		});
	} catch (e) {}
}