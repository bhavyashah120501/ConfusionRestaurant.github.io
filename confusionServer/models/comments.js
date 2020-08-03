const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-currency').loadType(mongoose)
const User = require('./users')
const Dishes = require('./dishes')

const Currency = mongoose.Types.Currency
const commentSchema = new Schema({
	rating:{
		type:Number,
		min : 1,
		max :5,
		required : true
	},
	comment:{
		type:String,
		required:true,
		default:1
	},
	author:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	dish:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Dishes'
	}
},{
	timestamps:true
})


var Comments = mongoose.model('Comments',commentSchema)
module.exports = Comments