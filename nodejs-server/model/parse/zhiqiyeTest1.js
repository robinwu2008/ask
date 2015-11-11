var element = require('./element')
var z = require('./zhiqiyeTask');
var async = require('async');
var dd="威海"
var ss="深圳"
var k="居"
//z.addtask(dd+k,1,70)
//z.addtask(ss+k,1,70)
var lineReader = require('line-reader');

lineReader.eachLine('C:/temp/a.csv', function (line, last) {
    line=line.trim();
	z.addtask(line,1,70)
	console.log(line)
});