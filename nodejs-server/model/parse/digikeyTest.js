var digikey = require('./digikey')
var D = require('./pnDao');

//digikey.insert({url:"item.url",pn:"zuaaatest"})


// digikey.search("MAX232", function(data) {
// 	console.log(data)
// });
//digikey.info("http://www.digikey.com.cn/search/zh/STM32F103RBT6/497-6066-ND?recordId=1646341&keywords=STM32F103RBT6", function(data) {
//	digikey.insert(data,"product");
//})


digikey.getUrlList({},1,1,function(data){
	var a=[];
	a=data;
	for(var temp in a){
		url = a[temp].url;
		digikey.info(url,function(data2){
		digikey.insert(data2,"product");
	})
	}
})