var lineReader = require('line-reader');

var D = require('./zuaaDao');

var i = 0

var s="insert into seo_email (email) values "
var sql=s
lineReader.eachLine("E:\\temp\\q.txt", function(line, last) {
	i = i + 1 
	if (i == 100) {
		sql=sql+ "('"+line+"')" 
		D.runsql(sql)
		sql=s
		i=0
	}else{
		sql=sql+ "('"+line+"')," 
	}
	
});

