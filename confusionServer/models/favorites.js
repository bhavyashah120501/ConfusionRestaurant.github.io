const mongoose = require('mongoose')
const Schema  = mongoose.Schema
const User = require('./users')
const Dishes = require('./dishes')


const FavoriteSchema = new Schema({
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	dishes: [{type:mongoose.Schema.Types.ObjectId,
				ref:"Dishes"}]
})

var Favorites = mongoose.model('Favorites',FavoriteSchema)
module.exports = Favorites