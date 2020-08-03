const express = require('express')
const bodyParser = require('body-parser')
const Promos = require('../models/promos')
const promoRouter = express.Router()
var authenticate = require('../authenticate')
const cors = require('./cors')

promoRouter.use(bodyParser.json())

promoRouter.route('/')
// .options(cors.cors,(req,res)=>{ res.sendStatus(200) })
.get(cors.cors,(req,res,next)=>{
	Promos.find(req.query)
	.then((promos)=>{
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(promos)
	},(err)=>next(err))
	.catch((err)=>next(err))
})

.post(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Promos.create(req.body)
	.then((promo)=>{
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(promo)
	},(err)=>next(err))
	.catch((err)=>next(err))
})

.put(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode = 403
	res.end("Post operation is not supported")
})

.delete(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Promos.remove({})
	.then((promo)=>{
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(promo)
	},(err)=>next(err))
	.catch((err)=>next(err))
});

promoRouter.route('/:promoId')
.options(cors.cors,(req,res)=>{ res.sendStatus(200) })
.get(cors.cors,(req,res,next)=>{
	Promos.findById(req.params.promoId)
	.then((promo)=>{
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(promo)
	},(err)=>nex(err))
	.catch((err)=>next(err))
})
.post(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode = 404
	res.end('Post is not supported on : ' + req.url)
})
.put(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Promos.findByIdAndUpdate(req.params.promoId,{$set : req.body},{ new:true})
	.then((promo)=>{
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(promo)
	},(err)=>next(err))
	.catch((err)=>next(err))
})
.delete(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Promos.findByIdAndRemove(req.params.promoId)
	.then((promo)=>{
		res.statusCode = 200
		res.setHeader('Content-Type','application/json')
		res.json(promo)
	},(err)=>next(err))
	.catch((err)=>next(err))
})

module.exports = promoRouter