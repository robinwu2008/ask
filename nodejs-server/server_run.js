var CronJob = require('cron').CronJob;
var req = require('request');
var meizitu = require('./model/ReadMeizitu');
var oneyige = require('./model/ReadOneYige');
var lofter = require('./model/lofterImage');
var D = require('./model/zuaaDao');
//meizitu.dourl("http://www.meizitu.com/tags.php?/%c3%c0%cd%c8/");
//meizitu.doit();
//oneyige.doit();


D.list({
	state: 1
}, "cms_lofter", 1, 100, function(rows) {
	for (var i = 0; i < rows.length; i++) {
//		console.log(rows[i].name)
		lofter.readByAuthor(rows[i].name)
	}

})



new CronJob(' 1 1 * * * *', function(request, response) {
	console.log("1 1 * * * * ")
	meizitu.doit();
	oneyige.doit();
}, function() {
	console.log(" stop ")
}, true);