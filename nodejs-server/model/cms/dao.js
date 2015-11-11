var mysql = require('mysql');
var con = require('./config');
///////////////////////////////////////////

var pool = mysql.createPool({
	host: 'rdsrieqqfrieqqf.mysql.rds.aliyuncs.com',
	user: 'r8j9jqmpj84rxemv',
	password: 'qegoo2014',
	database: 'r8j9jqmpj84rxemv',
	port: 3306,
	connectionLimit: 10,
	supportBigNumbers: true
});

 
exports.setdb=function(config){
	dbconfig=config;
}


exports.find = function(where, table_name, cb) {
	pool.getConnection(function(err, connection) {
		var sql = ""
		sql = sql + "select * from " + table_name
		sql = sql + " where  "
		var index = 0;
		for (var i in where) { 
			val = where[i];
			if (index == 0) {
				sql = sql + i + "=" + "'" + val + "'"
			} else {
				sql = sql + " and "
				sql = sql + i + "=" + "'" + val + "'"
			}
			index = index + 1;
		}
		sql = sql + " limit 100";
		console.log(sql);
		try {
			connection.query(sql, function(err, rows, fields) {
				if (err) {
					connection.destroy()
				}; 
				cb(rows);
			}).on('end', function() {
				connection.destroy()
			});
		} catch (e) {

		}
	})
}


exports.insert = function(where, table_name) {
	pool.getConnection(function(err, connection) {

		var l = 0;
		for (var i in where) {
			l = l + 1;
		}
		var d = [];
		var sql = ""
		sql = sql + "insert into  " + table_name
		sql = sql + "("
		var index = 0;
		var filses = ""
		var w = ""
		for (var i in where) {
			d[index] = where[i]
			index++;
			filses = filses + " " + i + " "
			w = w + " ? "

			if (index < l) {
				filses = filses + " , "
				w = w + " , "
			}
		}
		sql = sql + filses + ") VALUES ( " + w + " )";
		try {
			connection.query(sql, d, function(err, data) {
				if (err) {
					console.log(err)
					connection.destroy()
				};
				//console.log('The r is: ', data);
			}).on('end', function() {
				connection.destroy()
			});
		} catch (e) {

		}
	});
}

