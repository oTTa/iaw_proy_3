'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/turismo', (err, res) => {
	if (err){
		throw err;
	}
	else{
		console.log('La conexión a la base de dato de turismo se realizo correctamente.');
		app.listen(port,function () {
			console.log("Servidor de api rest turismo escuchando en http://localhost:"+port);
		});
	}
} );