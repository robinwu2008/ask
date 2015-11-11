var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http');
var pg = require('pg');
var digikey = require('./model/parse/digikey')
var mouser = require('./model/parse/mouser')
var element = require('./model/parse/element')
var conString = "postgres://qic_pm:aaaaaaaa@192.168.3.150:5433/pm";
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
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
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		console.log("SELECT  pn from pm_pn where pn like '" + request.param("name").toLocaleUpperCase() + "%' limit 10");
		client.query("SELECT  pn from pm_pn where pn_key like  '" + request.param("name").toLocaleUpperCase() + "%' UNION SELECT pn FROM pm_supplier_pn  WHERE supplier_pn_key LIKE  '" + request.param("name").toLocaleUpperCase() + "%' limit 10 ", [], function(err, result) {
			done();

			if (err) {
				return console.error('error running query', err);
			}
			console.log(result.rows);
			var arrayList = [];
			for (i = 0; i < result.rows.length; i++) {
				arrayList[i] = result.rows[i].pn;
			}
			response.json(arrayList);
			client.end();
		});
	});
});
app.get('/search1', function(request, response) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var name = request.param("name");
		client.query("SELECT  * from pm_pn where pn_key like  '" + name + "%'    limit  10", [], function(err, result) {
			done();
			if (err) {
				return console.error('error running query', err);
			}
			response.json(result.rows);
			client.end();
		});
	});
});

app.get('/getListByPn', function(request, response) {
	pg.connect(conString, function(err, client, done) {
		console.log(request.param("pn"));
		if (err) {
			return console.error('error fething client from pool', err);
		}
		client.query("SELECT * FROM pm_product WHERE pn = '" + request.param("pn").toLocaleUpperCase() + "' limit 10 ", [], function(err, result) {
			done();
			if (err) {
				return console.log("error running query", err);
			}
			console.log(result.rows + "-------");
			//		response.json(result.rows);
			response.render("index", {
				"data": result.rows
			});
			client.end();
		});
	});
});


console.log("3000:")

app.listen(3000);