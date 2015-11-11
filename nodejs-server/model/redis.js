var redis = require("redis"),
redisclient = redis.createClient("6379","192.168.3.163");

 
var pg = require('pg');
var conString = "postgres://qic_pm:aaaaaaaa@192.168.3.150:5433/pm";
redisclient.on("error", function (err) {
        console.log("Error " + err);
});
//redisclient.lpush("t1","aaaaaaaaaaaaaaa",redis.print);
 
//redisclient.lrange("t1",0,-1,function(err, reply) { 
//	for(  a in reply){
//		console.log(reply[a])
//	}
//});

redisclient.keys("MAX*",function(err,reply){ 
		console.log(reply.length) 
})

//for(var i=1;i<100;i++){ 
//	pg.connect(conString, function(err, client, done) {
//		if (err) {
//			return console.error('error fetching client from pool', err);
//		} 
//		client.query("SELECT id, pn from pm_pn  limit 10000 offset  "+(i-1)*10000, function(err, result) { 
//			if (err) {
//				return console.error('error running query', err);
//			} 
//			var arrayList = [];
//			for(i=0;i<result.rows.length;i++){ 
				//redisclient.lpush("pn",result.rows[i].pn,redis.print);
//				redisclient.set(result.rows[i].pn,result.rows[i].id,redis.print);
//			}
//			console.log("done");
//			done(); 
			//client.end();
		//}); 
	//}); 
//}



 