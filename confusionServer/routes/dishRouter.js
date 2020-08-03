const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const Dishes = require('../models/dishes')

const cors = require('./cors')
const dishRouter = express.Router();

dishRouter.use(bodyParser.json())

dishRouter.route('/')
// .options(cors.cors,(req,res)=>{ res.sendStatus(200) })
.get(cors.cors,(req,res,next)=>{
	Dishes.find(req.query)
		.then((dishes)=>{
			console.log(dishes)
			res.statusCode = 200,
			res.setHeader('Content-Type','application/json')
			res.json(dishes)
		},
		(err)=>next(err))
		.catch((err)=>next(err))
})

.post(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.create(req.body)
	.then((dish)=>{
		console.log('Dish Created ',dish)
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(dish)
	},(err)=>next(err))
	.catch((err)=>next(err))
})

.put(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode = 403
	res.end("Post operation is not supported")
})

.delete(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.remove({})
	.then((res)=>{
		res.statusCode=200
		res.setHeader('Content-Type','application/json')
		res.json(resp)
	},(err)=>next(err))
	.catch((err)=>next(err))
});

dishRouter.route('/:dishId')
// .all((req,res,next)=>{
// 	res.statusCode=200
// 	res.setHeader("Content-Type","text/plain")
// 	next()
// })
.options(cors.cors,(req,res)=>{ res.sendStatus(200) })
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		res.statusCode=200
		res.setHeader('Content-Type','application/json')
		res.json(dish)
	},(err)=>next(err))
	.catch((err)=>next(err))
})
.post(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode = 404
	res.end('Post is not supported on : ' + req.url)
})
.put(cors.cors,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.findByIdAndUpdate(req.params.dishId , {$set:req.body} , {new:true})
	.then((dish)=>{
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(dish)
	},(err)=>next(err))
	.catch((err)=>next(err))
})
.delete(cors.cors,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.findByIdAndRemove(req.params.dishId)
	.then((dish)=>{
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(dish)
	},(err)=>next(err))
	.catch((err)=>next(err))
})

module.exports = dishRouter