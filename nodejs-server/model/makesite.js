var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http')
var async = require('async')
var express = require('express')
var mustache = require('mustache')
var app = express();
app.configure(function() {
	app.set('port', 88);
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('weeego'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.errorHandler());
});


var pool = mysql.createPool({
	host: 'rds3qmfin3qmfin.mysql.rds.aliyuncs.com',
	user: 'db24z2f7wjl7cpfj',
	password: 'aaaaaaaa',
	database: 'db24z2f7wjl7cpfj',
	port: 3306,
	connectionLimit: 10,
	supportBigNumbers: true
});

//index 
app.get('/index', function(request, response) {
	async.series({
			product: function(callback) {
				pool.getConnection(function(err, connection) {
					connection.query("select * from site_s_url  order by id desc  limit 0,32", function(err, rows, fields) {
						if (err) {
							connection.destroy()
						} else {
							callback(null, rows);
						};
					}).on('end', function() {
						connection.destroy()
					});
				});
			},
			ad: function(callback) {
				pool.getConnection(function(err, connection) {
					connection.query("select * from site_setting where k like 'ad%'  order by id  ", function(err, rows, fields) {
						if (err) {
							connection.destroy()
						} else {
							callback(null, rows);
						};
					}).on('end', function() {
						connection.destroy()
					});
				});
			},
			template: function(callback) {
				pool.getConnection(function(err, connection) {
					connection.query("select * from site_template where url like 'index'  ", function(err, rows, fields) {
						if (err) {
							connection.destroy()
						} else {
							callback(null, rows);
						};
					}).on('end', function() {
						connection.destroy()
					});
				});
			}
		},
		function(err, results) {
			response.write(mustache.to_html(results.template[0].content, results))
		});
});


app.get('/item-:catlogid/:page', function(request, response) {
	async.series({
		product: function(callback) {
			pool.getConnection(function(err, connection) {
				connection.query("select * from site_s_url where type_id=" + request.params.catlogid + " order by id  limit " + (request.params.page - 1) * 24 + ",24", function(err, rows, fields) {
					if (err) {
						connection.destroy()
					} else {
						callback(null, rows);
					};
				}).on('end', function() {
					connection.destroy()
				});
			});
		},
		ad: function(callback) {
			pool.getConnection(function(err, connection) {
				connection.query("select * from site_setting where k like 'ad%'  order by id  ", function(err, rows, fields) {
					if (err) {
						connection.destroy()
					} else {
						callback(null, rows);
					};
				}).on('end', function() {
					connection.destroy()
				});
			});
		},
		template: function(callback) {
			pool.getConnection(function(err, connection) {
				connection.query("select * from site_template where url like 'index'  ", function(err, rows, fields) {
					if (err) {
						connection.destroy()
					} else {
						callback(null, rows);
					};
				}).on('end', function() {
					connection.destroy()
				});
			});
		}
	}, function(err, results) {
		response.write(mustache.to_html(results.template[0].content, results))
	});
});


app.get('/item/:page', function(request, response) {
	async.series({
		product: function(callback) {
			pool.getConnection(function(err, connection) {
				connection.query("select * from site_s_url  order by id  limit " + (request.params.page - 1) * 24 + ",24", function(err, rows, fields) {
					if (err) {
						connection.destroy()
					} else {
						callback(null, rows);
					};
				}).on('end', function() {
					connection.destroy()
				});
			});
		},
		ad: function(callback) {
			pool.getConnection(function(err, connection) {
				connection.query("select * from site_setting where k like 'ad%'  order by id  ", function(err, rows, fields) {
					if (err) {
						connection.destroy()
					} else {
						callback(null, rows);
					};
				}).on('end', function() {
					connection.destroy()
				});
			});
		},
		template: function(callback) {
			pool.getConnection(function(err, connection) {
				connection.query("select * from site_template where url like 'index'  ", function(err, rows, fields) {
					if (err) {
						connection.destroy()
					} else {
						callback(null, rows);
					};
				}).on('end', function() {
					connection.destroy()
				});
			});
		}
	}, function(err, results) {
		response.write(mustache.to_html(results.template[0].content, results))
	});
});

app.listen(88);