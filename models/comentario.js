'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

var comentario_schema = schema({
	fecha: Date,
	contenido: String,
	paquete: {type: schema.ObjectId, ref:'paquete'},
	usuario: {type: schema.ObjectId, ref:'usuario'}
});

module.exports = mongoose.model('comentario',comentario_schema);