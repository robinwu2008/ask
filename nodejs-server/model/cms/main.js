var dao = require('./dao');
exports.action = function(action, request, response) {
	eval(action + "(request,response)")
} 
function setting(request, response) {
	dao.find({"1":"1"},"cms_setting",function(data){ 
		var re={}
		for (var i = data.length - 1; i >= 0; i--) {
			re[data[i].k]=data[i].v
		};
		response.json(re);
	})   
}


