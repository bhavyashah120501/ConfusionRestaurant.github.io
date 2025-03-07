const express = require('express')
const cors = require('cors')
const app = express()


const whitelist = ['http://localhost:3001','https://localshost:3443','http://localhost:3000']
var corsOptionsDelegate = (req,callback)=>{
	var corsOptions;
	console.log('headers' , req.header)
	if(whitelist.indexOf(req.header('Origin')) !== -1 ){
		corsOptions = { origin: true }
	}
	else{
		corsOptions  =  { origin : false }
	}
	callback(null,corsOptions)
}

exports.cors = cors()
exports.corsWithOptions = cors(corsOptionsDelegate)

