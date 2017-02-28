/**
 * npm install express-session --save
 * https://www.npmjs.com/package/express-session
 */
var express = require('express')
	, http = require('http')
	, path = require('path')
	, winstonLogger = require('./winstonLogger')
	, bodyParser = require('body-parser')
	, cookieParser = require('cookie-parser')
	, expressSession = require('express-session');

var log = winstonLogger.logger;
var app = express();

app.use(cookieParser());
app.use(expressSession({
	secret:'sessionKey',
	resave:true,
	saveUninitialized:true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));

http.createServer(app).listen(3000, function(){
	log.debug("Express server port 3000 start");
});

app.get('/product', function(req, res){
	log.debug('get URL /product');
	
	if(req.session.user){
		res.redirect('/product.html');
	}else{
		res.redirect('/Login.html');
	}
});

app.get('/login', function(req, res){
	log.debug('get URL /login');
	res.redirect('/Login.html');
});

app.post('/login', function(req, res){
	log.debug('post URL /login');
	
	var loginId = req.body.loginId;
	var password = req.body.password;
	
	if(req.session.user){
		log.debug("login on");
		res.redirect("/Login.html");
	}else{
		req.session.user = {
				id:loginId,
				name:loginId,
				authorized:true
		};

		res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
		
		res.write("<div><h1>login info</h1></div>");
		res.write("<div><p>loginId : "+ loginId +"</p></div>");
		res.write("<div><p>password : "+ password +"</p></div>");
		res.write("<div><p>authorized : "+ req.session.user.authorized +"</p></div>");
		
		res.write("<br><a href='/product'> 상품 보러가기</a> ");
		res.end();
	}
	
});

app.get('/logout', function(req, res){
	log.debug("get URL /logout");
	
	if(req.session.user){
		log.debug("user logout");
		
		req.session.destroy(function(err){
			if(err){
				throw err;
			};
			
			res.redirect('/Login.html');
		});
	}else{
		log.debug("user login yet");
		res.redirect("/login");
	}
});










