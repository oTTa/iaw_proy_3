'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

var paquete_schema = schema({
	fecha_salida: Date,
	fecha_regreso: Date,
	costo: Number,
	descripcion: String,
	url_video: String,
	destino: {type: schema.ObjectId, ref:'destino'}
});

module.exports = mongoose.model('paquete',paquete_schema);