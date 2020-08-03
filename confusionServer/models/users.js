const mongoose = require('mongoose')
const Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')
const Favorites = require('./favorites')

var User= new Schema({
	firstname:{
		type:String,
		default:''
	},
	lastname:{
		type:String,
		default:''
	},
	facebookId : String,
	admin:{
		type:Boolean,
		default:false
	},
	favorites:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Favorites'
	}
})
User.plugin(passportLocalMongoose)
module.exports =  mongoose.model('User',User)