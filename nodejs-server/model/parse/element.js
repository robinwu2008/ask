var cheerio = require('cheerio');
var parse = require('./baseparse');
var MongoClient = require('mongodb').MongoClient;
var lineReader = require('line-reader');
var async = require('async');
exports.search = function(key, cb) {
	parse.readmsg("http://cn.element14.com/jsp/search/browse.jsp?N=0&Ntk=gensearch&Ntt=" + key + "&Ntx=mode matchallpartial&exposeLevel2Refinement=true&suggestions=false&ref=globalsearch", function(datadata) {
		var $ = cheerio.load(datadata);
		var re = [];
		//先找到页面上分类的链接地址，通过分类找到需要分析的列表地址，逐一分析
		var ls = readListUrl(datadata);
		//这里分析列表
		var doit = 0
		if (ls.length > 0) {
			async.each(ls, function(url, callback) {
				console.log(url.url)
				elementlistFormUrl(url.url, function(data) {
					doit = doit + 1;
					re = re.concat(data);
					console.log("doit：" + doit)
					console.log("ls.length：" + ls.length)
					if (doit == ls.length) {
						console.log("do me ")
						if (re.length < 1) {
							var r = elementinfo(datadata);
							if (r.pn.length > 2) {
								re.push(r)
							} else {
								re.push({
									"pn": "没找到"
								})
							}
						}
						cb(re);
					}
				})
			})
		} 
	});
}




//分析详情页 
exports.info = function(url, cb) {
	parse.readmsg(url, function(datadata) {
		cb(elementinfo(datadata))
	})
}


exports.list = function(url1, cb) {
	parse.readmsg(url1, function(datadata) {
		cb(elementlist(datadata))
	})
}

function readListUrl(html) {
	var $ = cheerio.load(html);
	var re = []
	$("dd a").each(function(index, item) {
		re.push({
			"url": "http://cn.element14.com" + $(item).attr("href")
		})
	})
	return re
}

function elementlistFormUrl(url, cb) {
	parse.readmsg(url, function(html) {
		//console.log(html);
		var re = elementlist(html);  
		if (re.length < 1) {
			console.log("检测是不是详情页面") 
			var r = elementinfo(html);
			if (r.pn.length > 2) {
				console.log("发现是详情页面")
				re.push(r)
			}else{
				console.log("发现不是详情页面"+r.pn)
			}
		} 
		cb(re)
	})
}

function elementlist(html) {
	var $ = cheerio.load(html);
	var re = [];
	$(".prodImage").each(function(index, item) {
		var jiage = "";
		$(".PriceListContent").eq(index).find("tr").each(function(ind, ite) {
			jiage = jiage + $(ite).find("td").eq(0).text() + ":" + $(ite).find("td").eq(1).text() + ","
		})
		var kucun = ""
		$("table[class=sc_b0]").eq(index).find("tr").each(function(ind, ite) {
			kucun = kucun + $(ite).find("td").eq(0).text() + ":" + $(ite).find("td").eq(1).text() + ","
		})
		re.push({
			pn: $(item).find("img").eq(0).attr("title"),
			jiage: jiage,
			url: "http://cn.element14.com" + $(item).find("a").eq(0).attr("href"),
			kucun: kucun
		})
	})

	return re;
}



function elementinfo(html) {
	var $ = cheerio.load(html);
	var re = {}; 
	re.pn = $(".pd_details dd").eq(2).text()
	re.kucun = $(".availability table").text() 
	console.log("详情页面pn"+re.pn)
	var jiage = ""
	$("#otherquantites tr").each(function(index, item) {
		jiage = jiage + $(this).find("td").eq(0).text() + ":" + $(this).find("td").eq(1).text() + ","
	})
	re.jiage = jiage
	return re;
}