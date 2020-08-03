const express = require('express')
const bodyParser = require('body-parser')
const Favorites = require('../models/favorites')
const Dishes = require('../models/dishes')
const User = require('../models/users')
const authenticate = require('../authenticate')
const cors = require('./cors')
const favouriteRouter = express.Router()


favouriteRouter.use(bodyParser.json())


favouriteRouter.route('/')
// .options(cors.cors,(req,res)=>res.sendStatus(200))
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
	Favorites.find({user : req.user._id})
			.populate('user')
			.populate('dishes')
			.then((favorites)=>{
				if(favorites!=null && favorites!=undefined && favorites.length !=0){
					res.statusCode=200
					res.setHeader('Content-Type','application/json')
					res.json(favorites[0])
				}
				else{
					var error = new Error('No dish selected')
					error.status = 403
					next(err)
				}
			},(err)=>next(err))
			.catch(err=>next(err))
})


.delete(cors.cors , authenticate.verifyUser , (req,res,next)=>{
	Favorites.findOne({user:req.user._id})
	.then(favorites=>{
		if(favorites.length == 0){
			var error = new Error('Dish Not found')
			error.status = 404
			next(error)
		}
		else{
			favorites.dishes = []
			favorites.markModified("dishes")
			favorites.save()
			.then(favorites => {
				Favorites.findById(favorites._id)
				.populate('dishes')
				.populate('user')
				.then(favoritee=>{
					res.statusCode = 200
					res.setHeader('Content-Type','application/json')
					res.json(favoritee)
				},err=>next(err))
			})
			
		}
	},err=>next(err))
	.catch(err=>next(err))
})

favouriteRouter.route('/:dishId')
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
	Favorites.findOne({user : req.user._id})
			.populate('user')
		.populate('dishes')
	.then((favorites)=>{
		if(!favorites){
			res.statusCode = 200
			res.setHeader('Content-Type','application/json')
			res.json({'exists':false,'favorites':favorites})
		}
		else{
			if(favorites.dishes.indexOf(req.params.dishId)===-1){
				res.statusCode = 200
				res.setHeader('Content-Type','application/json')
				res.json({'exists':false,'favorites':favorites})
			}
			else{
				res.statusCode = 200
				res.setHeader('Content-Type','application/json')
				res.json({'exists':true,'favorites':favorites})
			}
		}
	},(err=>next(err)))
	.catch((err)=>next(err))
})



.post(cors.cors,authenticate.verifyUser,(req,res,next)=>{
	Favorites.findOne({user:req.user._id})
	.populate('user')
	.populate('dishes')
	.then((favorite)=>{
		if(favorite.length !=0){

			favorite.dishes.push(req.params.dishId)
			favorite.markModified("dishes")
			favorite.save()
			.then(favorite=>{
				Favorites.findById(favorite._id)
				.populate('dishes')
				.populate('user')
				.then((favorites)=>{
					res.setHeader('Content-Type','application/json')
					res.statusCode = 201
					res.json(favorites)
				})
			})
		}
		else{
			Favorites.create({user:req.user._id})
			.then((favorites)=>{
				favorites.dishes.push(req.params.dishId)
				favorites.markModified("dishes")
				favorites.save()
				.then(favorite=>{
					Favorites.findById(favorite._id)
					.populate('dishes')
					.populate('user')
					.then((favoritee)=>{
						res.setHeader('Content-Type','application/json')
						res.statusCode = 201
						res.json(favoritee)
					})
				})
				
			})
		}
	},err=>next(err))
	.catch((err)=>next(err))
})

.delete(cors.cors,authenticate.verifyUser,(req,res,next)=>{
	Favorites.findOne({user:req.user._id})
	.populate('dishes')
	.populate('user')
	.then((favorites)=>{
		// var Y = `"${req.params.dishId}"`
		// var index = favorites.dishes.indexOf(Y)
		// if (index > -1) {
		// 	favorites.dishes.slice(index,1)
		// }
		// console.log(index)
		// console.log(Y)
		// console.log(favorites.dishes)
		favorites.dishes = favorites.dishes.filter((dish)=> {
			console.log(dish._id,req.params.dishId)
			if(!dish._id.equals(req.params.dishId)){
				console.log(dish._id)
				return dish._id
			}
	
		})
		favorites.markModified("dishes")
		favorites.save()
		.then(favorites=>{
			Favorites.findById(favorites._id)
			.populate('dishes')
			.populate('user')
			.then((favorite)=>{
				res.statusCode = 203
				res.setHeader('Content-Type','application/json')
				res.json(favorite)
			})
		})
		
	})
})


module.exports = favouriteRouter










//for i=1:m
//   Y=zeros(size(Theta2,1),1)
//   Y(y(i)) = 1
//   R = sigmoid(Theta1*X(i,:)')
//   P = [1 ; R]
//   Q = sigmoid(Theta2*P)
//   J = J + -(1/m)*(Y'*(log(Q)) + (1-Y)'*(log(1-Q)))
//   a = (Q-Y)
//   Theta2_grad = Theta2_grad + a*P'
//   b = ((Theta2)'*a).*(P.*(1-P))
//   Theta1_grad = Theta1_grad + b(2:end)*X(i,:)
// endfor

// Theta2_grad = Theta2_grad/m

// Theta1_grad = Theta1_grad/m


// Theta1_grad(:,2:end) = Theta1_grad(:,2:end) + (lambda/m)*Theta1(:,2:end)
// Theta2_grad(:,2:end) = Theta2_grad(:,2:end) + (lambda/m)*Theta2(:,2:end)