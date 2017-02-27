/**
 * npm install cookie-parser --save
 * https://www.npmjs.com/package/cookie-parser
 */
var express = require('express')
	, http = require('http')
	, path = require('path')
	, winstonLogger = require('./winstonLogger')
	, bodyParser = require('body-parser')
	, cookieParser = require('cookie-parser');

var log = winstonLogger.logger;

var app = express();

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));

http.createServer(app).listen(3000, function(){
	log.debug("Express server port 3000 start");
});

app.get('/setUserCookie', function(req, res){
	log.debug("call setUserCookie ");
	
	res.cookie('user', {
		id : "rain",
		name : "rain",
		authorized : false
	});
	
	res.redirect('/showUserCookie');
});

app.get('/showUserCookie', function(req, res){
	log.debug("call showUserCookie");
	res.send(req.cookies);
});