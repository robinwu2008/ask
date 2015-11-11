/**
*存储所有的抓取的信息
*/
var mysql = require('mysql');
var CronJob = require('cron').CronJob;
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
///////////////////////////////////////////// 
exports.endTask=function(id,state){
	run(pool,"update pn_task set state = ? where id = ?",[state,id],function () {
		 
	})
} 


exports.runjob=function(cb){
	var job = new CronJob('*/10 * * * *  *', function(request, response) {
		cb();
	}, function() {
		console.log("stop")
	}, true);
}
exports.addTask = function(where) { 
	pool.getConnection(function(err, connection) {

		var l = 0;
		for (var i in where) {
			l = l + 1;
		}
		var d = [];
		var sql = ""
		sql = sql + "insert into  pn_task" 
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
			}).on('end', function() {
				connection.destroy()
			});
		} catch (e) {

		}
	});
}
 


exports.readTask = function(taskNameOrid,cb) { 
	pool.getConnection(function(err, connection) { 
		connection.query("select * from pn_task where (state = 0  or state is null ) and( id='"+taskNameOrid+"' or taskname='"+taskNameOrid+"' )limit 0 , 1", function(err, rows, fields) {
			if (err) {
				connection.destroy()
			} else {
				console.log("ssssssssss"+rows.length);
				if(rows.length>0){
 					run(pool,"update pn_task set state = 2 where id = ?",[rows[0].id],function (data) { 
 						console.log(data,rows)
 						cb(rows);
 					})
 				}

			};
		}).on('end', function() {
			connection.destroy()
		}); 
	}) 
} ;


function run(pool,sql,d,cb) {
	pool.getConnection(function(err, connection) {  
		try {
			connection.query(sql, d, function(err, data) {
				if (err) {
					console.log(err)
					connection.destroy()
				};
				
				cb(data);
			}).on('end', function() {
				connection.destroy()
			});
		} catch (e) {

		}
	});
}