/**
 * Created by 平 on 2014/11/6.
 */
var async = require('async')


var mysql = require('mysql');
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


pool.getConnection(function (err, connection) {
    async.series({
            head: function (callback) {
                connection.query("select * from seo_email_163 limit 0 ,10", function (err, rows, fields) {
                    if (err) {
                        connection.destroy()
                    } else {
                        callback(null, rows);
                    }
                });
            },
            foot: function (callback) {
                connection.query("select * from seo_email_163 limit 10 ,10", function (err, rows, fields) {
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

})