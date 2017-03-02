var express = require('express'),
	http = require('http'),
	path = require('path'),
	multer  = require('multer'),
	fs = require('fs'),
	bodyParser = require('body-parser');

var uploadPath = __dirname + "/uploads";

fs.exists(uploadPath, function(exists) {
	if( !exists){
		fs.mkdir(uploadPath, function(){
			console.log("new folder [" + uploadPath + "] ");
		});
	}
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
    	console.dir(file);
    	
    	var str = file.originalname.split(".");
    	console.dir(str);
    	console.dir(str.length);
    	
    	var fileExtension = str[str.length -1];
    	var date = Date.now();
        callback(null, date+'.'+fileExtension);
    }
});

var upload = multer({ 
    storage: storage,
    limits: {
		files: 10,
		fileSize: 1024 * 1024 * 1024
	}
});

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));




var router = express.Router();

//fileupload.html input name = photo, upload file = 2
//https://www.npmjs.com/package/multer
router.route('/process/photo').post(upload.array('photo', 2), function (req, res, next) {
	try {
		var files = req.files;
	
        console.dir('#===== 업로드된 첫번째 파일 정보 =====#')
        console.dir(req.files[0]);
        console.dir('#=====#')
        
		var originalname = '',
			filename = '',
			mimetype = '',
			size = 0;
        
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		
		if (Array.isArray(files)) {   // 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
	        console.log("배열에 들어있는 파일 갯수 : %d", files.length);
	        
	        if(files.length > 0){
	        	res.write('<h3>파일 업로드 성공</h3>');
	        	res.write('<hr/>');
	        	for (var index = 0; index < files.length; index++) {
	        		originalname = files[index].originalname;
	        		filename = files[index].filename;
	        		mimetype = files[index].mimetype;
	        		size = files[index].size;
	        		
	        		console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', ' + mimetype + ', ' + size);
	        		
	        		res.write('<p>원본 파일명 : ' + originalname + ' -> 저장 파일명 : ' + filename + '</p>');
	        		res.write('<p>MIME TYPE : ' + mimetype + '</p>');
	        		res.write('<p>파일 크기 : ' + size + '</p>');
	        	}
	        }else{
	        	res.write('<h3>업로드할 파일이 없습니다.</h3>');
		        res.write('<hr/>');
	        }
	    } else {
	    	res.write('<h3>파일 업로드 실패</h3>');
	        res.write('<hr/>');
	    }
		res.end();
		
	} catch(err) {
		console.dir(err.stack);
	}
	
});

app.use('/', router);


//Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});