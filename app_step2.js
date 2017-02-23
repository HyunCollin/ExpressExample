//https://expressjs.com/en/4x/api.html
var express = require('express')
	, http = require('http')
	, path = require('path')
	, winstonLogger = require('./winstonLogger');

var log = winstonLogger.logger;

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	log.debug("1번 middleware ");
	
	var userAgent = req.header('User-Agent');
//	express deprecated req.param(name): Use req.params, req.body, or req.query 
	var name = req.query.name;
	
	res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
	res.write('<h1> userAgent : '+ userAgent +'</h1>');
	res.write('<h1> name : '+ name +'</h1>');
	res.write("<img src='/images/1487764445_cat_laptop.png' width='50%' >");
	res.end();
	
});

http.createServer(app).listen(3000, function(){
	log.debug("Express server port 3000 start");
});