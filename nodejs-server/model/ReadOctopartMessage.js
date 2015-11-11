// http://www.qic.com.cn/specialstore/toStoreContact.action?specialId=  28129   54979

var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http')
var async = require('async')
var D = require('./zuaaDao');

readMes("http://octopart.com/manufacturers/I?listing_start=0")



function readMes(url) {


 	var options = {
 		host: "www.octopart.com",
 		path: "/manufacturers/I?listing_start=0",
 		method: "get",
 		headers: {
 			"Accept": "application/json, text/javascript, */*; q=0.01",
 			"Accept-Language": "zh-cn",
 			"Cache-Control": "no-cache",
 			"Connection": "Keep-Alive",
 			"Host": "www.octopart.com",
 			"Referer": "http://www.octopart.com/",
 			"User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)",
 			"X-Requested-With": "XMLHttpRequest",
 			"Cookie":"SID=b668581de2df5aff56407fe1e4782e994d2a8e2c6a9e109b52284fffa0c44991df76900f; _sio=1c1f2df7-a68e-47e5-b3f7-085b24da702d----; __qca=P0-2029838702-1411108243146; __insp_slim=1411108244010; __insp_nv=true; __insp_ref=d; __gads=ID=22461b60f68f5ba4:T=1411108243:S=ALNI_MYpTBJFcmMrDmvr0ThhY_SwKsCpDw; __insp_norec_sess=true; ajs_user_id=null; ajs_group_id=null; __utma=91165828.1813307550.1411108243.1411108243.1411108243.1; __utmb=91165828.6.10.1411108243; __utmc=91165828; __utmz=91165828.1411108243.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __oasid=8a23904d-6ea4-4296-986c-15f275544d17; __oavid=b29beb16-cf74-4e07-a4d8-4f1f7def9e61"
 		}
 	};


	http.get(options, function(res) {
		var bufferHelper = new BufferHelper();
		res.on('data', function(chunk) {
			bufferHelper.concat(chunk);
		});
		res.on('end', function() {
			var html = iconv.decode(bufferHelper.toBuffer(), 'utf-8');
			var $ = cheerio.load(html);
			console.log(html);
			$("a").each(function(index) {
				console.log($(this).text());
			})



			// D.insert({ 
			// lianxiren:$("li").get(0).text,
			// dianhua:$("li").get(1).text,
			// shouji:$("li").get(2).text,
			// chuanzhen:$("li").get(3).text,
			// qq:$("li").get(4).text,
			// msn:$("li").get(5).text,
			// gongsidizhi:$("li").get(6).text,
			// youxiang:$("li").get(7).text,
			// gongsiwangzhi:$("li").get(8).text
			// }, "crm_company");


		});
	})

}