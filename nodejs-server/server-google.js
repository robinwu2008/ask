var express = require('express')
var app = express();
var CronJob = require('cron').CronJob;
app.set('ids', '33');
var req = require('request');
// ///////////////////
app.configure(function() {
	app.set('port', 18080);
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('weeego'));
	app.use(app.router);
	app.use(express.errorHandler());
});

app.get('/taskid', function(request, response) {
	// request.query
	var id = request.query.id;
	if (id > 0) {
		app.set('ids', id);
	}
});

app.listen(80);

// for ( var i = 6; i <= 16; i++) {
// runTaskAuto('heiji' + i + '.duapp.com/crawl-execute-baidu/');
// }
//
// for ( var i = 1; i <= 9; i++) {
// runTaskAuto('heiji' + i + '.aliapp.com/');
// }

var googleHosts = "heiji1zuaa,heiji2zuaa,heiji3zuaa,heiji4zuaa,heiji5zuaa,heiji6-zuaa,heiji7zuaa,heiji8zuaa,"
		+ "heiji9zuaa,heiji0zuaa,heiji10zuaa,heiji11zuaa,heiji12zuaa,heiji13zuaa,heiji14zuaa,heiji15zuaa,"
		+ "heiji16zuaa,heiji17zuaa,heiji18zuaa,heiji19zuaa,heiji20zuaa,heiji21zuaa,heiji22zuaa,heiji23zuaa,heijizuaa";

var googlehost = googleHosts.split(',');
for ( var i = 0; i < googlehost.length; i++) {
	runTaskAuto(googlehost[i] + '.appspot.com/');
}

function runTaskAuto(host) {

	new CronJob(' */5 * * * * *', function(request, response) {
		req('http://' + host + 'TaskUrl?taskUrl=' + app.get('ids'), function(
				error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(host)
				console.log(body)
			}
		})
	}, function() {
		console.log("stop")
	}, true);
	new CronJob(' */5 * * * * *', function(request, response) {
		req('http://' + host + 'ReadTaskServlet', function(error, response,
				body) {
			if (!error && response.statusCode == 200) {
				console.log(host)
				console.log(body)
			}
		})
	}, function() {
		console.log("stop")
	}, true);
	new CronJob(' * * * * * *', function(request, response) {
		try {
			req('http://' + host + 'DealTaskServlet', function(error, response,
					body) {
				if (!error && response.statusCode == 200) {
					console.log(host)
					console.log(body)
				}
			})
		} catch (e) {

		}
	}, function() {
		console.log("stop")
	}, true);
	new CronJob(' * * * * * *', function(request, response) {
		try {
			req('http://' + host + 'DealTaskServlet', function(error, response,
					body) {
				if (!error && response.statusCode == 200) {
					console.log(host)
					console.log(body)
				}
			})
		} catch (e) {

		}
	}, function() {
		console.log("stop")
	}, true);
	new CronJob(' * * * * * *', function(request, response) {
		try {
			req('http://' + host + 'DealTaskServlet', function(error, response,
					body) {
				if (!error && response.statusCode == 200) {
					console.log(host)
					console.log(body)
				}
			})
		} catch (e) {

		}
	}, function() {
		console.log("stop")
	}, true);

}
