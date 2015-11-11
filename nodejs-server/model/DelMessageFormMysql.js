 var mysql = require('mysql');
 var request = require('request');
 var cheerio = require('cheerio');
 var iconv = require('iconv-lite');
 var BufferHelper = require('bufferhelper');
 var http = require('http')
 var async = require('async')
 var D = require('./zuaaDao');

 //seo_email



 for (var i = 3000000; i < 4000000; i++) {
 	delMsgId(i) 
 } 
 function delMsgId(id) {
 	D.find({
 		id: id
 	}, "seo_email", function(argument) {

 		if (argument.length > 0) {
 			var sql = "delete   from seo_email where email='" + argument[0].email + "' and id<> " + argument[0].id + " "
 			console.log(sql) 
 			D.readMsg(sql)
 		}
 	})
 }