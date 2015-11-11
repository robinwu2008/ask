var express = require('express');
var app = express();
var path = require('path');

var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http');



var pg = require('pg');
var conString = "postgres://qic_pm:aaaaaaaa@192.168.3.150:5433/pm";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));


app.get('/searchmouser', function(request, response) {
	searchPnFrommouser(request.param("name").toLowerCase(), function(data) {
		response.json(data);
	})
})

app.get('/searchdigikey', function(request, response) {
	searchPnFromDigikeyList(request.param("name"), function(data) {
		response.json(data);
	})
})




app.get('/search', function(request, response) {
	//	console.log(request.query + request.param("name") + "!" + request.params.name + "!@" + request.params.size)
	pg.connect(conString, function(err, client, done) {
			if (err) {
				return console.error('error fetching client from pool', err);
			}
			client.query("SELECT  pn from pm_pn where pn_key like  '" + request.param("name").toUpperCase(+"%'   limit 10 ", [], function(err, result) {
					done();

					if (err) {
						return console.error('error running query', err);
					}
					console.log(result.rows);
					var arrayList = [];
					for (i = 0; i < result.rows.length; i++) {
						arrayList[i] = result.rows[i].pn;
					}
					response.json(arrayList);
					client.end();
				});
			});
	}););
console.log("3000:")

app.listen(3000);

function searchPnFrommouser(key, cb) {
	var url = "http://www.mouser.cn/Search/Refine.aspx?Keyword=" + key
	http.get(url, function(res) {
		var bufferHelper = new BufferHelper();
		res.on('data', function(chunk) {
			bufferHelper.concat(chunk);
		});
		var re = []
		res.on('end', function() {
			var html = iconv.decode(bufferHelper.toBuffer(), 'UTF-8');
			var $ = cheerio.load(html);
			//console.log(html)
			$('.SearchResultsRowOdd').each(function(index, item) {
				if ($(item).find("td").eq(2).text().trim().length > 2) {
					re.push({
						"spn": $(item).find("td").eq(2).text().trim(),
						"pn": $(item).find("td").eq(3).text().trim(),
						"url": "http://www.mouser.cn/" + $(item).find("td").eq(3).find('a').attr("href"),
						"kucun": $(item).find("td").eq(7).text().trim(),
						"jiage": $(item).find("table").text()
					})
				}
			});
			$('.SearchResultsRowEven').each(function(index, item) {
				if ($(item).find("td").eq(2).text().trim().length > 2) {
					re.push({
						"spn": $(item).find("td").eq(2).text().trim(),
						"pn": $(item).find("td").eq(3).text().trim(),
						"url": "http://www.mouser.cn/" + $(item).find("td").eq(3).find('a').attr("href"),
						"kucun": $(item).find("td").eq(7).text().trim(),
						"jiage": $(item).find("table").text()
					})
				}
			});
			if (re.length < 1) {
				re.push({
					"pn": "没找到"
				})
			}
			cb(re)
		});
	});
}


function searchPnFromDigikeyList(key, cb) {
	var url = "http://www.digikey.com.cn/search/zh?keywords=" + key + "&refPId=3&stock=1"
	http.get(url, function(res) {
		var bufferHelper = new BufferHelper();
		res.on('data', function(chunk) {
			bufferHelper.concat(chunk);
		});
		var re = []
		res.on('end', function() {
			var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(), 'UTF-8'));
			console.log(iconv.decode(bufferHelper.toBuffer(), 'UTF-8').length)
			$('#productTable tr').each(function(index, item) {
				$(item).find("td").eq(7).find("div").remove();
				if ($(item).find("td").eq(3).text().trim().length > 2) {
					console.log($(item).find("td").eq(3).text().trim())
					re.push({
						"spn": $(item).find("td").eq(3).text().trim(),
						"pn": $(item).find("td").eq(4).text().trim(),
						"url": "http://www.digikey.com.cn/" + $(item).find("td").eq(3).find('a').attr("href"),
						"kucun": $(item).find("td").eq(7).text().trim(),
						"jiage": $(item).find("td").eq(8).text().trim()
					})
				}
			});
			if (re.length < 1) {
				re.push({
					"pn": "没找到"
				})
			}
			cb(re)
		});
	});
}