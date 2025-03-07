const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-currency').loadType(mongoose)
const Currency = mongoose.Types.Currency

const PromosSchema = new Schema({
	name:{
		type:String,
		required:true
	},
	image:{
		type:String,
		required:true
	},
	label:{
		type:String,
		required:true
	},
	price:{
		type:Currency,
		required:true,
		min:0
	},
	description:{
		type:String,
		required:true
	},
	featured:{
		type:Boolean,
		required:true
	}
},{
	timestamps:true
})

var Promos = mongoose.model('Promos',PromosSchema)

module.exports = Promos