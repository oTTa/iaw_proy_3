'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var usuario_schema = schema({
	nombre: String,
	apellido: String,
	email: { type: String, unique: true },
	password: String,
	role: String,
	imagen: String
});

var usuario = mongoose.model('usuario',usuario_schema);

module.exports = usuario;