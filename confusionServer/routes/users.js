var express = require('express');
var router = express.Router();
const BodyParser = require('body-parser')
var passport = require('passport')
var User = require('../models/users')
var authenticate = require('../authenticate')
router.use(BodyParser.json())
const cors = require('./cors')

router.route('/')
// .options(cors.cors , (req,res)=> res.sendStatus(200))
.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next)=> {
  User.find({})
   .then((user)=>{
  	res.statusCode = 200
  	res.setHeader('Content-Type','application/json')
  	res.json({'users':user})
  })
  .catch((err)=>next(err))
});

router.route('/signUp')
.post(cors.cors,(req,res,next)=>{
	User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
		if(err){
			res.statusCode = 500
			res.setHeader('Content-Type','application/json')
			res.json({err:err})
		}
		else{
			    if(req.body.firstname)
			    	user.firstname = req.body.firstname
			    if(req.body.lastname)
			    	user.lastname = req.body.lastname
			    user.save((err,user)=>{
			    			    	if(err){
			    			    		res.statusCode = 500
			    			    		res.setHeader('Content-Type','application/json')
			    			    		res.json({err:err})
			    			    		return
			    			    	}
			    			    	passport.authenticate('local')(req,res,()=>{
			    					res.statusCode = 200
			    					res.setHeader('Content-Type','application/json')
			    					res.json({success:true,status:'Registration Successfull'})
			    			    })
			})
		}
	})
	// User.findOne({ username : req.body.username })
	// .then((user)=>{
	// 	if(user != null){
	// 		var err = new Error('User with',req.body.username,'already exists')
	// 		err.status = 403
	// 		return next(err)
	// 	}
	// 	else{
	// 		return User.create({
	// 			username : req.body.username,
	// 			password : req.body.password
	// 		})
	// 	}
	// })
	// .then((user)=>{
	// 		res.statusCode = 200
	// 		res.setHeader('Content-Type','application/json')
	// 		res.json({status:"Registration Successfull",user:user})
	// 	},(err)=>next(err))
	// .catch((err)=>{
	// 	next(err)
	// })
})

router.post('/login', cors.cors,(req,res,next)=>{
	passport.authenticate('local',(err,user,info)=>{
		if(err){
			return next(err)
		}
		if(!user){
			res.statusCode = 401
			res.setHeader('Content-Type','application/json')
			res.json({success:false,status:'login  unsuccesfull',info:info})
		}
		req.logIn(user,(err)=>{
			if(err){
				res.statusCode = 200
				res.setHeader('Content-Type','application/json')
				res.json({success:true,status:'login  unsuccesfull',info:'error while logging in'})
			}
			var token = authenticate.getToken({_id:req.user._id})
			res.statusCode = 201
			res.setHeader('Content-Type','application/json')
			res.json({success:true,status:'login  succesfull',token:token})
		})

	})(req,res,next)
    //giving token
	// if(!req.session.user){
	// 	var authHeader = req.headers.authorization
	// 	if(authHeader){
	// 		var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(":")
	// 		username = auth[0]
	// 		password = auth[1]
	// 		User.findOne({username : username})
	// 		.then((user)=>{
	// 			if(user === null){
	// 				var error  = new Error('User',username,'Does not exists')
	// 				error.status = 403
	// 				return next(error)
	// 			}
	// 			else if(user.password !== password){
	// 				var error = new Error('Your Password is incorrect')
	// 				error.status = 403
	// 				return next(error)
	// 			}
	// 			else{
	// 				req.session.user = 'authenticated'
	// 				res.statusCode = 200
	// 				res.setHeader('Content-Type','text/plain')
	// 				res.end('You are authenticated')
	// 			}
	// 		})
	// 		.catch((err)=>next(err))

	// 	}
	// 	else{
	// 		var error = new Error('You are not authenticated')
	// 		res.setHeader('WWW-Authenticate','Basic')
	// 		error.status = 401
	// 		return next(error)
	// 	}
	// }
	// else{
	// 	res.statusCode = 200
	// 	res.setHeader('Content-Type','text/plain')
	// 	res.end('You are already authenticated')
	// }
})


router.get('/logout',cors.cors,(req,res,next)=>{
	if(req.session){
		req.session.destroy()
		res.clearCookie('session-id')
		res.redirect('/')
	}
	else{
		var err = new Error('You are not logged in')
		err.status = 403
		return next(err)
	}
})


router.get('/facebook/token',passport.authenticate('facebook-token'),(req,res)=>{
	if(req.user){
		var token = authenticate.getToken({_id : req.user._id})
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.end({success : true , token : token , status : 'You are successfully logged in'})
	}
})

router.get('/checkJWTToken',cors.cors,(req,res,next)=>{
	passport.authenticate('jwt',{session:false},(err,user,info)=>{
		if(err){
			return next(err)
		}
		if(!user){
			res.statusCode = 401
			res.setHeadere('Content-Type','application/json')
			return res.json({status:'JWT invalid' , success:false , info:info})
		}
		else{
			
			res.statusCode = 200
			res.setHeadere('Content-Type','application/json')
			return res.json({status:'JWT valid' , success:true , user:user})
		}
	})(req,res)
})

module.exports = router;
