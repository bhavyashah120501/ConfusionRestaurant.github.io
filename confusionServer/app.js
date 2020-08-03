var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dishRouter = require('./routes/dishRouter')
var  promoRouter = require('./routes/promoRouter')
var leaderRouter = require('./routes/leaderRouter')
var uploadRouter = require('./routes/uploadRouter')
var mongoose = require('mongoose')
const Dishes = require('./models/dishes')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var passport = require('passport')
var config = require('./config.js')
var authenticate = require('./authenticate')
var favouriteRouter = require('./routes/favouriteRouter')
var app = express();
const cors = require('cors')
var CommentsRouter = require('./routes/commentRouter')
app.all('*',(req,res,next)=>{
	if (req.secure){
		return next()
	}
	else{
		res.redirect(307,'https://' + req.hostname + ':' + app.get('secPort') + req.url)
	}
})



const url = config.mongoUrl
const connect = mongoose.connect(url)

connect.then((db)=>{
	console.log("Connected To The Server")
}).catch((err)=>console.log(err))

app.use(cors())

// app.use(session({
// 	name:'session-id',
// 	secret:'12345-67890-09876-54321',
// 	saveUninitialized: false,
// 	resave : false,
// 	store : new FileStore()
// }))
app.use(passport.initialize())
// app.use(passport.session())

app.use('/', indexRouter);
app.use('/users', usersRouter);

// function auth(req,res,next){
// 	console.log(req.headers)
// 	console.log(req.signedCookies)
// 	if(!req.signedCookies.user ){
// 		console.log(req.headers)
// 		var authHeader = req.headers.authorization

// 		if(!authHeader){
// 			var err = new Error('you are not authenticated')
// 			res.setHeader('WWW-Authenticate','Basic')
// 			err.status = 401
// 			return next(err)
// 		}
// 		else{
// 			var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':')
// 		    var username = auth[0]
// 		    var password = auth[1]

// 		    if(username === 'admin' && password === 'password'){
// 		    	res.cookie('user', 'admin',{signed:true})
// 		    	next()
// 		    }
// 		    else{
// 		    	var err = new Error('You are not authenticated')
// 		    	res.setHeader('WWW-Authenticate','Basic')
// 		    	err.status = 401
// 		    	return next(err)
// 		    }

// 		}
// 	}
// 	else{
// 		if(req.signedCookies.user === 'admin'){
// 			next()
// 		}
// 		else{
// 			var err = new Error('You are not Authenticated')
// 			err.status = 401
// 			return next(err)
// 		}
// 	}
// }

// function auth(req,res,next){
// 	console.log(req.headers)
// 	console.log(req.session)
// 	if(!req.session.user ){
// 		var error = new Error('You are not Authenticated')
// 		err.status = 401
// 		return next(err)
// 	}
// 	else{
// 		if(req.session.user === 'authenticated'){
// 			next()
// 		}
// 		else{
// 			var err = new Error('You are not Authenticated')
// 			err.status = 401
// 			return next(err)
// 		}
// 	}
// }

// function auth(req,res,next){
// 	if(!req.user){
// 		var error = new Error('You are not authenticated')
// 		error.status = 403
// 		return next(error)
// 	}
// 	else{
// 		next()
// 	}
// }
// }

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(auth)


app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/dishes',dishRouter)
app.use('/leaders',leaderRouter)
app.use('/promotions',promoRouter)
app.use('/imageUpload',uploadRouter)
app.use('/favorites',favouriteRouter)
app.use('/comments',CommentsRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// app.use(cors())

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
