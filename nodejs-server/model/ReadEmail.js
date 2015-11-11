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
var post_data = querystring.stringify({
	usertype: 0,
	username: "bjxqtz",
	password: "432101",
	btLogin: "登录"
});
var options = {
	headers: {
		'X-Custom-Header': 'Bumbaway atuna'
	}
}

needle.post('http://www.hehboo.com/Default.aspx', post_data, options, function(err, resp) {
	session = resp.headers["set-cookie"][0];
	async.series([
		run("2987yuna040325", 376711),
	], function(err, values) {

	});

});



function resetsession() {
	needle.post('http://www.hehboo.com/Default.aspx', post_data, options, function(err, resp) {
		session = resp.headers["set-cookie"][0]
	});
}


function run(cid, num) {
	console.log(cid + "|||" + num)
	var a = num / 500 + 1
	for (var i = 1; i <= a; i++) {
		try {
			readMessage(cid, i, session)
		} catch (e) {
			try {
				async.series([
					resetsession(), readMessage(cid, i, session)
				], function(err, values) {

				});
			} catch (e) {}
		}
	}
}

function readMessage(c, i, session) {
	var options = {
		host: "www.hehboo.com",
		path: "/stat_view.aspx?clientid=" + c + "&pagesize=500&page=" + i,
		method: "post",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"Accept": "application/json, text/javascript, */*; q=0.01",
			"Accept-Language": "zh-cn",
			"Cache-Control": "no-cache",
			"Connection": "Keep-Alive",
			"Host": "www.hehboo.com",
			"Referer": "http://www.hehboo.com/",
			"User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)",
			"X-Requested-With": "XMLHttpRequest",
			"Cookie": session
		}
	};

	try {
		http.get(options, function(res) {
			var bufferHelper = new BufferHelper();
			res.on('data', function(chunk) {
				bufferHelper.concat(chunk);
			});
			res.on('end', function() {
				var html = iconv.decode(bufferHelper.toBuffer(), 'utf-8');
				var $ = cheerio.load(html);
				console.log("=============" + c + "|||||" + i + "=======================")


				var insql = "insert into seo_email (email) values "
				$('tbody tr').each(function() {
					$(this).find("td").each(function(index, item) {
						if (index == 0) {
							insql = insql + "('" + $(this).text().replace('\\', "") + "'),"
						}
					})
				})
				insql = insql + "('zuaa@163.com')"
				console.log(insql);
				D.readMsg(insql);
			});
		})
	} catch (e) {

		try {
			http.get(options, function(res) {
				var bufferHelper = new BufferHelper();
				res.on('data', function(chunk) {
					bufferHelper.concat(chunk);
				});
				res.on('end', function() {
					var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(), 'utf-8'));
					console.log("=============" + c + "|||||" + i + "=======================")
					$('#ttbody tr').each(function() {
						$(this).find("td").each(function(index, item) {
							if (index == 0) {
								savemessage({
									email: $(this).text()
								})
							}
						})
					})
				});
			})
		} catch (e) {

		}

	}

}

function savemessage(data) {
	D.find({
		email: data.email
	}, "seo_email", function(rows) {
		if (rows.length > 0) {
			//console.log("email is here do nothing") 
		} else {
			D.insert(data, "seo_email")
		}
	})
}