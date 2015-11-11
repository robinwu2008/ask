var cheerio = require('cheerio');
var parse = require('./baseparse');
var MongoClient = require('mongodb').MongoClient;
var lineReader = require('line-reader');
var async = require('async');

exports.search = function(key,page, cb) {
	parse.readmsg("http://www.zhiqiye.com/search/list?kwd="+encodeURI(key)+"&sType=4&page="+page, function(datadata) {
		var $ = cheerio.load(datadata);
		var re = [];
		//先找到页面上分类的链接地址，通过分类找到需要分析的列表地址，逐一分析
		$(".item").each(function(index,item){
			var a1=s($(item).find(".sub-item").eq(0).text());
			var a2=s($(item).find(".sub-item").eq(1).text());
			var a3=s($(item).find(".sub-item").eq(2).text());
			var m=delrep(a1.concat(a2,a3));
			re.push({
				url:$(item).find('a').attr("href"),
				name:$(item).find('a').text(),
				//"message1":delrep(a1.concat(a2,a3)),
				"message":m.toString(),
				"email":rEmail(m),
				"photo":rPhoto(m)
			})
		})
		cb(re);
	})
}

function rEmail(res){
		var re=[]
	for(var i =0 ;i<res.length;i++){
		if(isEmail(res[i])){
			re.push(res[i])
		}
	}
	return re.toString()
}
function rPhoto(res)
{
	 var re=[]
	for(var i =0 ;i<res.length;i++){
		if(isPhoto(res[i])){
			re.push(res[i])
		}
	}
	return re.toString()
}

function s(str){
	var reg = /[联系人：手机：邮箱：法人：电话：传真： \n\t\r地址：暂未提供]/;
	str= str.replace(reg, " ")
	var res = str.split(reg);
	var re =[]
for(var i =0 ;i<res.length;i++){
	if(res[i]==""){

		}
		else{
		re.push(res[i])
		}
}

return re;
}

function isPhoto(str){
	return  /^1[3|4|5|8][0-9]\d{4,8}$/.test(str)
}

function isEmail(str)
{
	return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(str)
}


function delrep(a) {
    var n = {}
    ,   r = []
    a.forEach(function(v){
        if (!n[typeof(v) + v]) {
            n[typeof(v) + v] = true
            r.push(v)
        }
    })
    return r
}