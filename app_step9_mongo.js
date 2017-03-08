/**
 * npm install mongodb --save
 */
var express = require('express'),
	http = require('http'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	expressSession = require('express-session'),
	expressErrorHandler = require('express-error-handler'),
	winstonLogger = require('./winstonLogger');

var log = winstonLogger.logger;

var mongodb = require('mongodb');
var database;
function connectDB(){
	var databaseUrl = 'mongodb://localhost:27017/shopping';
	
	mongodb.connect(databaseUrl, function(err, db){
		if(err) throw err;
		log.info("mongodb://localhost:27017/shopping");
		database = db;
	});
}

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(cookieParser());
app.use(expressSession({
	secret:'sessionKey',
	resave:true,
	saveUninitialized:true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ' + app.get('port'));
  connectDB();
});

//join
app.get('/join', function(req, res){
	log.info("get request /join");
	res.redirect('/Join.html');
});

app.post('/join', function(req, res){
	log.info("post request /join");
	
	var userName = req.body.userName;
	var userId = req.body.userId;
	var userPassword = req.body.userPassword;
	
	if(database){
		addUser(database,userName, userId, userPassword, function(err, result){
			if(err) throw err;
			
			if(result){
				log.debug(result);
				
				res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
				res.write('<h2>사용자 추가 완료</h2>');
				res.end();
			}else{
				res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
				res.write('<h2>사용자 추가 실패</h2>');
				res.end();
			}
		});
	}else{
		res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
		res.write('<h2>database 연결 실패</h2>');
		res.end();
		
	}
	
});

var addUser = function(database, name, id, password, callback){
	log.debug("addUser()");
	
	var users = database.collection('users');
	
	users.insert([{"name":name, "id":id, "password":password}], function(err, result){
		if(err){
			callback(err, null);
			return;
		};
		callback(null, result);
	});
	
	log.info("addUser done");
}

//login
app.get('/login', function(req, res){
	log.info("get request /login");
	res.redirect('/login.html');
});

app.post('/login', function(req, res){
	log.info("post request /login");
	
	var loginId = req.body.loginId;
	var password = req.body.password;
	
	var users = database.collection('users');
	users.find({"id":loginId, "password":password}).toArray(function(err, docs){
		if(err){
			throw err;
			return;
		}
		
		if(docs.length > 0){
			log.debug("find : loginId [%s], password [%s]", loginId, password);
			console.dir(docs);
			console.log(docs[0].name);
			
			res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
			res.write('<h2>로그인 완료</h2>');
			res.write('<br>');
			res.write("<div><h1>로그인 정보</h1></div>");
			res.write("<div><p>name : "+ docs[0].name +"</p></div>");
			res.write("<div><p>loginId : "+ loginId +"</p></div>");
			res.write("<div><p>password : "+ password +"</p></div>");
			res.end();
		}else{
			log.debug("not find");
			res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
			res.write('<h2>로그인 실패</h2>');
			res.end();
		}
	});
});

