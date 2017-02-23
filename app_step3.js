/**
 * Login.html , post param
 * npm install body-parser --save
 */
var express = require('express')
	, http = require('http')
	, path = require('path')
	, winstonLogger = require('./winstonLogger')
	, bodyParser = require('body-parser');

var log = winstonLogger.logger;
 
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req, res, next){
	log.debug("1번 middleware ");
	
	var loginId = req.body.loginId;
	var password = req.body.password;
	log.debug("req.body : "+loginId + ", " + password);

	loginId = req.param('loginId');
	password = req.param('password');
	log.debug("req.param : "+loginId + ", " + password);
	
	res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
	res.end();
	
});

http.createServer(app).listen(3000, function(){
	log.debug("Express server port 3000 start");
});