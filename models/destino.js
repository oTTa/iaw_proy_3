'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

var destino_schema = schema({
	nombre: String,
	ciudad: String,
	provincia: String,
	pais: String,
	latitud: SchemaTypes.Double,
	longitud: SchemaTypes.Double
});

module.exports = mongoose.model('destino',destino_schema);