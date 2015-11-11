var baiji = require('./baiji');
var digikey = require('./digikey')
baiji.runjob(function() {
	baiji.readTask("zuaa", function(data) {
		digikey.info(data[0].key, function(data2) {
			digikey.insert(data2, "pn_product");
			baiji.endTask(data[0].id, 1)
		})
	})
})