var express = require('express')
var app = express();
var async = require('async')
var mysql = require('mysql');
///////////////////////////////////////////
var pool = mysql.createPool({
    host: 'rds3qmfin3qmfin.mysql.rds.aliyuncs.com',
    user: 'db24z2f7wjl7cpfj',
    password: 'aaaaaaaa',
    database: 'db24z2f7wjl7cpfj',
    port: 3306,
    connectionLimit: 10,
    supportBigNumbers: true
});

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

 
// 获取资讯
app.get('/index', function(request, response) {
	console.log("find message" + request.params.id + "!" + request.params.name)

    pool.getConnection(function (err, connection) {
        async.series({
                shopType: function (callback) {
                    connection.query("select * from site_product_type", function (err, rows, fields) {
                        if (err) {
                            connection.destroy()
                        } else {
                            callback(null, rows);
                        }
                    });
                },
                product: function (callback) {
                    connection.query("select * from site_s_url order by id desc  limit 0 ,24", function (err, rows, fields) {
                        if (err) {
                            connection.destroy()
                        } else {
                            callback(null, rows);
                        }
                    });
                }
            },
            function (err, results) {
                connection.destroy();
                console.log(results);
            });
    });



});

app.listen(88);