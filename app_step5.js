/**
 * express-error-handler error 404
 * 
 */
var express = require('express')
	, http = require('http')
	, path = require('path')
	, winstonLogger = require('./winstonLogger')
	, bodyParser = require('body-parser')
	, expressErrorHandler = require('express-error-handler');

var log = winstonLogger.logger;
var errorHandler = expressErrorHandler({
	static : {
		'404': './public/404.html'
	}
});
var app = express();

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));

http.createServer(app).listen(3000, function(){
	log.debug("Express server port 3000 start");
});

app.post('/login', function(req, res){
	log.info("call /login");
	
	var loginId = req.body.loginId;
	var password = req.body.password;
	log.debug("req.body : "+loginId + ", " + password);
	res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
	res.write("<div><p>LoginID : "+ loginId +"</p></div>");
	res.write("<br><br>");
	res.write("<a href='/Login.html' >로그인 페이지로 돌아가기");
	res.end();
	
});

app.get('/join', function(req, res){
	log.info("call /join get");
	res.redirect("/Join.html");
});

app.post('/join', function(req, res){
	log.debug("call /join post");
	
	var userId = req.body.userId;
	var userPassword = req.body.userPassword;
	log.debug("req.body : "+userId + ", " + userPassword);
	
	res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
	res.write("<div><p>userId : "+ userId +"</p></div>");
	res.write("<div><p>userPassword : "+ userPassword +"</p></div>");
	res.end();
});