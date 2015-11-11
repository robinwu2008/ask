var cheerio = require('cheerio');
var parse = require('./baseparse');
var MongoClient = require('mongodb').MongoClient;
var lineReader = require('line-reader');
var D = require('./pnDao');


exports.insert = function(item,table) {
	D.find({
		pn: item.pn
	}, table, function(rows) {
		if (rows.length < 1) {
			D.insert(item, table)
		} else {
			console.log('i am here')
		}
	})
}


exports.search = function(key, cb) {
		parse.readmsg("http://www.digikey.com.cn/search/zh?keywords=" + key + "&refPId=3&stock=1", function(datadata) {
			var $ = cheerio.load(datadata);
			var re = [];

			$('#productTable tr').each(function(index, item) {
				console.log("aaa");
				$(item).find("td").eq(7).find("div").remove();
				if ($(item).find("td").eq(3).text().trim().length > 2) {
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
				var r = digikeyinfo(datadata);
				if (r.pn.length > 10) {
					re.push(r)
				} else {
					re.push({
						"pn": "没找到"
					})
				}
			}
			cb(re);
		});
	}
	//分析详情页 
exports.info = function(url, cb) {
	parse.readmsg(url, function(datadata) {
		cb(digikeyinfo(datadata))
	})
}

function digikeyinfo(html) {
	var $ = cheerio.load(html);
	var re = {};
	re.pn = $("#PartNumber").text()

	var jiage = "";
	var jia = $("#pricingTable table tr");
	jia.each(function(i, elem) {
		jiage = jiage + $(this).find("td").eq(0).text() + ":" + $(this).find("td").eq(1).text() + ",\n\t";
	});
	re.jiage = jiage
	$("#pricingTable table").remove()
	re.kucun = $("#pricingTable  tr").eq(2).text()
	re.url = $("link[rel=canonical]").attr("href")
	return re;
}


/**
 * 分析下一页
 * @param {Object} html
 * @param {Object} cb
 */
exports.readNextpageUrl = function(html, cb) {
	var $ = cheerio.load(html);
	//下一页
	var irun = 1
	$("a").each(
		function(index, item) {
			if ($(item).text().trim() == "下一页") {
				if (irun == 1) {
					cb("http://www.digikey.com.cn" + $(item).attr("href"));
				}
				irun = irun + 1
			}
		}
	)
}


exports.getUrlList = function(where,page,size,cb){
	var re = [];
	re = D.list(where,"pn",page,size,cb);
	return re;
}
