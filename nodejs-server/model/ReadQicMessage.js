// http://www.qic.com.cn/specialstore/toStoreContact.action?specialId=  28129   54979

var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http')
var async = require('async')
var D = require('./zuaaDao');

readMes("http://www.qic.com.cn/specialstore/toStoreContact.action?specialId=54979")



function readMes(url) {
	try {
		http.get(url, function(res) {
			var bufferHelper = new BufferHelper();
			res.on('data', function(chunk) {
				bufferHelper.concat(chunk);
			});
			res.on('end', function() {
				var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(), 'utf-8'));
				var lianxiren, dianhua, shouji, chuanzhen, qq, msn, gongsidizhi, youxiang, gongsiwangzhi;
				$("li").each(function(index) {
					var m
					if (index == 0) {
						m = $(this).text();
						lianxiren = console.log(m.replace("联  系  人：", ""))
					}
					if (index == 1) {
						m = $(this).text();
						dianhua = console.log(m.replace("电　　话：", ""))
					}
					if (index == 2) {
						m = $(this).text();
						shouji = console.log(m.replace("手　　机：", ""))
					}
					if (index == 3) {
						m = $(this).text();
						chuanzhen = console.log(m.replace("传　　真：", ""))
					}
					if (index == 4) {
						m = $(this).text();
						qq = console.log(m.replace("Q     Q：", ""))
					}
					if (index == 5) {
						m = $(this).text();
						msn = console.log(m.replace("M  S  N：", ""))
					}
					if (index == 6) {
						m = $(this).text();
						gongsidizhi = console.log(m.replace("公司地址：", ""))
					}

					if (index == 7) {
						m = $(this).text();
						youxiang = console.log(m.replace("邮　　箱：", ""))
					}

					if (index == 8) {
						m = $(this).text();
						gongsiwangzhi = console.log(m.replace("公司网站：", ""))
					}

				})
				D.insert({
					lianxiren: lianxiren,
					dianhua: dianhua,
					shouji: shouji,
					chuanzhen: chuanzhen,
					qq: qq,
					msn: msn,
					gongsidizhi: gongsidizhi,
					youxiang: youxiang,
					gongsiwangzhi: gongsiwangzhi
				}, "crm_company");


			});
		})
	} catch (e) {

	}
}

 