var express = require('express')
var app = express();
var path = require('path');
var digikey = require('./model/parse/digikey')
var mouser = require('./model/parse/mouser')
var element = require('./model/parse/element')
var parse = require('./model/parse/alibaseparse');
var z = require('./model/parse/zhiqiyeTask');
var CronJob = require('cron').CronJob;
var zhiqiye = require('./model/parse/zhiqiye');
var pg = require('pg');
var conString = "postgres://qic_pm:aaaaaaaa@192.168.3.150:5433/pm";
var user = require('./model/cms/user.js')
var cms = require('./model/cms/main.js')
app.configure(function() {
	app.set('port', 18080);
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('expressdemo'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.errorHandler());
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'html')));

app.use(express.cookieParser('zuaacookie'));  
app.use(express.session({ cookie: { maxAge: 2 * 60 * 1000 } , secret: "session secret" }));

app.get('/qiye', function(request, response) {
	zhiqiye.search(request.param("name"), 1, function(data) {
		response.json(data);
	})
})

app.get('/searchmouser', function(request, response) {
	mouser.search(request.param("name").toLowerCase(), function(data) {
		response.json(data);
	})
})
app.get('/searchdigikey', function(request, response) {
	digikey.search(request.param("name"), function(data) {
		response.json(data);
	})
})
app.get('/searchelement', function(request, response) {
	element.search(request.param("name"), function(data) {
		response.json(data);
	})
})

app.get('/search', function(request, response) {
	response.json(['ATB4SL13']);
});

app.get('/getmfsandpn', function(request, response) {
	response.json([{
		mfs: "mfs",
		pn: "nnnsssssnn",
		spn: "sddddddss",
		price: {
			p: {
				1: 0.1,
				10: 0.01
			}
		}
	}]);
});

app.get('/fenling', function(request, response) {
	parse.readmsgBycode(request.param("url"), request.param("code"), function(datadata) {
		response.write(datadata)
	})
})

app.get('/runTask', function(request, response) {
	z.runtask()
	response.json(['do']);
});



app.get('/user/:action', function(request, response) {
	user.action(request.params.action, request, response)
})
app.get('/cms/:action', function(request, response) {
	cms.action(request.params.action, request, response)
})


app.listen(0);



// job for server
//var job = new CronJob('1/30 * * * *  *', function(request, response) {
//	z.runtask();
//}, function() {
//	console.log("stop")
//}, true);



function getClientIp(req) {
	return req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
};