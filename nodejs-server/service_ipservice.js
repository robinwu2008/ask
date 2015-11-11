var express = require('express');
var app = express(); 
app.configure(function() {
	app.set('port', 88);
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('23123123123'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.errorHandler());
});

app.get('/ip', function(request, response) {  
			response.json(getClientIp(request)); 
});
app.listen(88);
function getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

