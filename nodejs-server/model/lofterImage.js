var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http')
var D = require('./zuaaDao');
var FeedParser = require('feedparser'),
	request = require('request');
exports.readByAuthor = function(domain) {
	var req = request("http://" + domain + ".lofter.com/rss"),
		feedparser = new FeedParser();
	console.log(domain+"::::read this domain lofter")
	req.on('error', function(error) {
		// handle any request errors
	});
	req.on('response', function(res) {
		var stream = this;

		if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

		stream.pipe(feedparser);
	});
	feedparser.on('error', function(error) {
		// always handle errors
	});
	feedparser.on('readable', function() {
		// This is where the action is!
		var stream = this,
			meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
			,
			item;

		while (item = stream.read()) {
			//			console.log(item["title"]);
			//			console.log(item["description"]); 
			savemessage({
				title: item["title"],
				content: item["description"],
				"artic": domain,
				"type_id": 5,
				graburl: item["link"]
			})
		}
	});
}


function savemessage(data) {
	D.find({
		graburl: data.graburl
	}, "cms_post", function(rows) {
		//console.log(rows.length)
		if (rows.length > 0) {
			//console.log("bu baocun ")
		} else {
			D.insert(data, "cms_post")
		}
	})
}