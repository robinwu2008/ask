 
var dao = require('./dao');
exports.action = function(action, request, response) {
	eval(action + "(request,response)")
}

function save(request, response) {
	console.log("i am here");
	response.json(["i am here"]);
}
function whoami(request, response) {
	console.log(request.session.user);
	response.json({name:request.session.user});
}
function update(request, response) {
	console.log("i am here");
	response.json(["i am update"]);
}

function login(request, response) { 
	console.log(request.param("name"));
	console.log(request.param("psw"));
	dao.find({"name":request.param("name"),"psw":request.param("psw")},"cms_user",function(data){
		request.session.user = request.param("name"); 
		response.json(data);
	}) 
}



