//https://expressjs.com/en/4x/api.html
var express = require('express')
	, http = require('http')
	, path = require('path')
	, winstonLogger = require('./winstonLogger');

var log = winstonLogger.logger;

var app = express();
app.use(function(req, res, next){
	log.debug("1번 middleware ");
	
	req.user = "collin";
	next();
	
});

app.use('/', function(req, res, next){
	log.debug("2번 middleware");
	
	res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
	res.write('<h1>'+ req.user +'</h1>');
	
	//Can't set headers after they are sent.
//	res.send({user:'collin', country:'korea'});
	
	res.end('<h1>Express server에서 응답한 결과입니다.</h1>');
});

http.createServer(app).listen(3000, function(){
	log.info("Express server port 3000 start");
});