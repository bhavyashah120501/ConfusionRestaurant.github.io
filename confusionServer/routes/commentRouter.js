const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const Comments = require('../models/comments')

const cors = require('./cors')
const CommentsRouter = express.Router();

CommentsRouter.use(bodyParser.json())

CommentsRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>sendStatus(200))
.get(cors.cors,(req,res,next)=>{
	Comments.find(req.query)
	    .populate('author')
		.then((comments)=>{
			console.log(comments)
			res.statusCode = 200,
			res.setHeader('Content-Type','application/json')
			res.json(comments)
		},
		(err)=>next(err))
		.catch((err)=>next(err))
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	if(req.body != null){
		req.body.author = req.user._id
		Comments.create(req.body)
		.then((comments)=>{
			Comments.findById(comments._id)
			.populate('author')
			.then((comments)=>{
				res.statusCode = 200
				res.setHeader('Content-Type','application/json')
				res.json(comments)
			})
		},(err)=>next(err))
		.catch((err)=>next(err))
	}
	else{
		var error = new Error('comment not found in request body')
		error.status = 404
		return next(err)
	}
	
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode = 403
	res.end("Post operation is not supported")
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Comments.remove({})
	.then((res)=>{
		res.statusCode=200
		res.setHeader('Content-Type','application/json')
		res.json(res)
	},(err)=>next(err))
	.catch((err)=>next(err))
});

CommentsRouter.route('/:commentId')

.options(cors.corsWithOptions,(req,res)=>{ res.sendStatus(200) })
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
	Comments.findById(req.params.commentId)
	.populate('author')
	.then((comments)=>{
		res.statusCode=200
		res.setHeader('Content-Type','application/json')
		res.json(comments)
	},(err)=>next(err))
	.catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode = 404
	res.end('Post is not supported on : ' + req.url)
})
.put(cors.corsWithOptions,authenticate.verifyAdmin,(req,res,next)=>{
	Comments.findById(req.params.commentId)
	.then((comments)=>{
		if(comments!=null){
		if(comments.author == req.user._id){
			req.body.author = req.user._id
			Comments.findByIdAndUpdate(req.params.commentId , {$set:req.body} , {new:true})
			.then((comments)=>{
				Comments.findById(comments._id)
				.populate('author')
				.then((comments)=>{
					res.statusCode = 200
					res.setHeader('Content-Type','application/json')
					res.json(comments)
				})
			})
		}
		else{
			var error = new Error('You are not allowed')
			err.status = 401
			return next(err)
		}
	}
	else{
		var error = new Error('Comment not found')
		error.status = 404
		return next(error)
	}
	},(err)=>next(err))
	.catch((err)=>next(err))
})
.delete(cors.corsWithOptions,authenticate.verifyAdmin,(req,res,next)=>{
	Comments.findById(req.params.commentId)
	.then((comments)=>{
		if(comments!=null){
			if(comments.author === req.user._id){
				Comments.findByIdAndRemove(req.params.commentId)
				.then((comments)=>{
					res.statusCode = 200
					res.setHeader('Content-Type','application/json')
					res.json(comments)
				})
			}
			else{
				var error = new Error('You are not authorized')
				error.status = 401
				return next(error)
			}
		}
		else{
			var error = new Error('Comment does not exist')
			error.status = 404
			return next(error)
		}
	},(err)=>next(err))
	.catch((err)=>next(err))
})


module.exports = CommentsRouter