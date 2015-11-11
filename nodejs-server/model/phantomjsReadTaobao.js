////run phantomjs **
//phantomjs --output-encoding=gb2312 --script-encoding=utf8 
//控制台输出中文
var page = require('webpage').create();
//var url = "http://detail.tmall.com/item.htm?id=41559655911&ali_refid=a3_430337_1006:1103779409:N:%B6%F9%CD%AF%CD%E6%BE%DF:d37afbc1d0285d1c597264d8f8a073ba&ali_trackid=1_d37afbc1d0285d1c597264d8f8a073ba&spm=0.0.0.0.BghSdC"
//page.open(url, function(status) {
//	var title = page.evaluate(function() {
//		return document.getElementsByClassName("tm-price")
//	});
//	for (var i = 0; i < title.length; i++) {
//		if (title[i] != null) {
//			console.log(title[i].innerHTML);
//		}
//	}
//	console.log('完成');
//	phantom.exit()
//});



page.open('http://www.baidu.com/s?wd=%20快易购&rsv_spt=1&issp=1&f=8&rsv_bp=0&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=0&rsv_sug3=34&rsv_sug4=1552&rsv_sug1=28&inputT=14554&oq=PhantomJS%20&rsv_sug2=0&rsp=0', function(status) {
	var title = page.evaluate(function() {
		console.log(document);
		return document.getElementsByTagName("table")
	});
	for (var i = 0; i < title.length; i++) {
		if (title[i] != null) {
			console.log(title[i].innerHTML);
		}
	}
	console.log('完成');
	phantom.exit()
});