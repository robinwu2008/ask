/**
 * Created by 平 on 2014/11/12.
 */
var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http')


readMessage("http://www.zhiqiye.com/search/list?kwd=%E6%B7%B1%E5%9C%B3+%E5%AE%B6%E7%A7%81&sType=0&page=1")

function readMessage(url){
    http.get(url,function(res){
        var bufferHelper = new BufferHelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end',function(){
            var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(),'GBK'));
            var c=$(".seach-result li")
             console.log(c.length)
        });
    })
}

