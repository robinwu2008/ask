var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http')
var D = require('./zuaaDao');
var async = require('async')
async.series([
	readIndex("http://www.mtu5.com/siwaqiaotun/", listPage),
	readIndex("http://www.mtu5.com/dadanmeinv/", listPage),
	readIndex("http://www.mtu5.com/xingganmeinv/", listPage),
	readIndex("http://www.mtu5.com/qingchunmeinv/", listPage),
	readIndex("http://www.mtu5.com/rihanmeinv/", listPage),
	readIndex("http://www.mtu5.com/gaoqingmeitu/", listPage),
	readIndex("http://www.mtu5.com/meinvrewu/", listPage)
], function(err, values) {

});



function listPage($, baseSrc) {
	$(".page a").each(function(index, item) {
		if ($(item).text() == "下一页") {
			console.log("here i am here" + baseSrc + $(item).attr("href"))
			readIndex(baseSrc + $(item).attr("href"))
		}
	})
}

function readIndex(url, listPage) {
	http.get(url, function(res) {
		var bufferHelper = new BufferHelper();
		res.on('data', function(chunk) {
			bufferHelper.concat(chunk);
		});
		res.on('end', function() {
			var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(), 'GBK'));
			$(".imgList a").each(function(index, item) {
				readMessage("http://www.mtu5.com/" + $(item).attr("href"), readOne, readPage, url)
			})
			if (typeof(listPage) == "function") {
				listPage($, url)
			}
		});
	})
}





function readOne($, url) {
	var c = $(".arcBody img").attr("src");
	var title = $("h1").text();
	if (c != undefined) {
		savemessage({
			title: title,
			content: "<img src='http://www.mtu5.com" + c + "'/>",
			"artic": "mtu5",
			"type_id": 6,
			"graburl": url
		})
	}
}

function readPage($, url, baseSrc) {
	var ps = $(".page a");
	ps.each(function(index, item) {
		if ($(item).attr("href") != undefined && $(item).attr("href") != "#") {
			readMessage(baseSrc + $(item).attr("href"), readOne)
		}
	})
}

function readMessage(url, readOne, readPage, baseurl) {
	http.get(url, function(res) {
		var bufferHelper = new BufferHelper();
		res.on('data', function(chunk) {
			bufferHelper.concat(chunk);
		});
		res.on('end', function() {
			var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(), 'GBK'));
			if (typeof(readOne) == "function") {
				readOne($, url, baseurl)
			}
			if (typeof(readPage) == "function") {
				readPage($, url, baseurl)
			}
		});
	})
}


function savemessage(data) {
	D.find({
		graburl: data.graburl
	}, "cms_post", function(rows) {
		if (rows.length > 0) {
			//console.log("bu baocun ")
		} else {
			console.log(rows.length)
			D.insert(data, "cms_post")
		}
	})
}