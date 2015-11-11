var cheerio = require('cheerio');
var parse = require('./baseparse');
var lineReader = require('line-reader');
exports.search = function(key, cb) {
	var url = "http://www.mouser.cn/Search/Refine.aspx?Keyword=" + key;
	parse.readmsg(url, function(html) {
		var $ = cheerio.load(html);
		var re = [];
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

}