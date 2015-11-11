var async = require('async')
var mysql = require('mysql');
var mustache = require('mustache');
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
            },seomsg:function(callback){
                connection.query("",function(err,rows,fields){

                })
            }
        },
        function (err, results) {
            connection.destroy();
            console.log(results);
        });
});

var template = '<h1>Test</h1><p>{{helloworld}}</p>';
var model = {helloworld:'Hello World'};
console.log(mustache.to_html(template,model));


















