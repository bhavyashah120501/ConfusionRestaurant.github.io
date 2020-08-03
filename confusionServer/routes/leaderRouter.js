const express = require('express')
const bodyParser = require('body-parser')
const leaderRouter = express.Router()
const Leaders = require('../models/Leaders')
const authenticate = require('../authenticate')
const cors = require('./cors')
leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
// .options(cors.cors,(req,res)=>{ res.sendStatus(200) })
.get(cors.cors,(req,res,next)=>{
	Leaders.find(req.query)
	.then((leaders)=>{
		res.statusCode =200
		res.setHeader('Content-Type','application/json')
		res.json(leaders)
	},(err)=>next(err))
	.catch((err)=>next(err))
})

.post(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Leaders.create(req.body)
	.then((leader)=>{
		res.statusCode =200
		res.setHeader('Content-Type','application/json')
		res.json(leader)
	},(err)=>next(err))
	.catch((err)=>next(err))
})

.put(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode = 403
	res.end("Post operation is not supported")
})

.delete(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Leaders.remove({})
	.then((leader)=>{
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(leader)
	},(err)=>next(err))
	.catch((err)=>next(err))
});

leaderRouter.route('/:leaderId')
.options(cors.cors,(req,res)=>{ res.sendStatus(200) })
.get(cors.cors,(req,res,next)=>{
	Leaders.findById(req.params.leaderId)
	.then((leader)=>{
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(leader)
	},(err)=>next(err))
	.catch((err)=>next((err)))
})
.post(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode = 404
	res.end('Post is not supported on : ' + req.url)
})
.put(cors.cors,authenticate.verifyUser,(req,res,next)=>{
	Leaders.findByIdAndUpdate(req.params.leaderId)
	.then((leader)=>{
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(leader)
	},(err)=>next(err))
	.catch((err)=>next(err))
})
.delete(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Leaders.findByIdAndRemove(req.params.leaderId)
	.then((leader)=>{
		res.statusCode =200
		res.setHeader('Content-Type','application/json')
		res.json(leader)
	},(err)=>next(err))
	.catch((err)=>next(err))
})

module.exports = leaderRouter