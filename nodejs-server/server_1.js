var express = require('express')

var app = express();

var CronJob = require('cron').CronJob;

var req = require('request');

var Tiny = require('tiny');
// ///////////////////

var c_upload = require('./control/upload');
var mongodbTools = require('./control/mongodbTools');

// ///////////////////
app.configure(function() {
	app.set('port', 18080);
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('weeego'));
	// app.use(express.session());
	app.use(app.router);
	app.use(express.errorHandler());
	// app.use(express.cookieSession());
});

app.use('', express.static(__dirname + '/public'));
// upload file test form
app.get('/uploadform', c_upload.form);
// upload file to server
app.post('/file-upload', c_upload.upload);
// show image in service
app.get('/tFile/:str', c_upload.show);

app.get('/add/:model', mongodbTools.mainfunction);

app.get('/fly', function(request, response) {
	// request.query
	var url = request.query.url;
	var turl = request.query.turl;
	var shop_id = request.query.shop_id
	var control = request.query.control

	// get  url =page_content
	
	
	
	// post turl
	// param.put("page_content", s);
	// param.put("shop_id", req.getParameter("shop_id"));
	// param.put("model", req.getParameter("model"));

});

app.listen(18080);

// job for server
var job = new CronJob('* * * * *  *', function(request, response) {

	for ( var i = 0; i < 10; i++) {
		fFrdom()
	}

}, function() {
	console.log("stop")
}, true);

function fFrdom() {
	req('http://fedom.com.hk/products02.asp?id='
			+ (49 + Math.floor(Math.random() * (15))), function(error,
			response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body.length)
		}
	})
}