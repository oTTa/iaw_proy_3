'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var destino_schema = schema({
	nombre: String,
	provincia: String,
	pais: String,
	latitud: Number,
	longitud: Number
});

module.exports = mongoose.model('destino',destino_schema);