var MongoClient = require('mongodb').MongoClient;
var mongodb = "mongodb://192.168.3.140:27017/ic362"

exports.saveTask = function(data) {
	MongoClient.connect(mongodb, function(err, db) {
		if (err) throw err;
		var collection = db.collection('tasks');
		collection.count(data, function(err, docs) {
			if (docs == 0) {
				save('tasks', data)
			}
			db.close();
		})
	})
}


exports.getTask = function(taskname, cb) {
	MongoClient.connect('mongodb://192.168.3.140:27017/ic362', function(err, db) {
		if (err) throw err;
		var collection = db.collection('tasks');
		var cursor = collection.findOne({
			taskname: taskname
		}, {
			skip: 0
		}, function(err, item) { //返回单条数据，skip i 的作用是从开始向后跳到i的位置开始返回数据
			cb(item);
			db.close();
		});

	})
}


exports.taskDone = function(url, taskname) {
	task(url, taskname, 1)
}

exports.taskError = function(url, taskname) {
	task(url, taskname, 2)
}


function save(tb, data) {
	MongoClient.connect(mongodb, function(err, db) {
		if (err) throw err;
		var collection = db.collection(tb);
		collection.insert(data, function(err, docs) {
			db.close();
		});
	})
}


function task(url, taskname, state) {
	MongoClient.connect(mongodb, function(err, db) {
		if (err) throw err;
		var collection = db.collection('tasks');
		collection.count({
			"url": url,
			taskname: taskname
		}, function(err, docs) {
			if (docs > 0) {
				collection.update({
					"url": url,
					taskname: taskname
				}, {
					'$set': {
						"url": url,
						taskname: taskname,
						state: state
					}
				}, {
					w: 1
				}, function() {
					db.close();
				});
			}
		})
	})
}