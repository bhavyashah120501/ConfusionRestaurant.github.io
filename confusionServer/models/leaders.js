const mongoose = require('mongoose')
const Schema  = mongoose.Schema

require('mongoose-currency').loadType(mongoose)
const Currency = mongoose.Types.Currency 

const LeaderSchema = new Schema({
	name:{
		type:String,
		required:true
	},
	image:{
		type:String,
		required:true
	},
	designation:{
		type:String,
		required:true
	},
	abbr:{
		type:String,
		required:true
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
	timestamps : true
})

const Leaders = mongoose.model('Leaders',LeaderSchema)

module.exports = Leaders