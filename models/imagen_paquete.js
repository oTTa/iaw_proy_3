'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

var imagen_paquete_schema = schema({
	url: String,
	url_thumbnail: String,
	paquete: {type: schema.ObjectId, ref:'paquete'}
});

module.exports = mongoose.model('imagen_paquete',imagen_paquete_schema);