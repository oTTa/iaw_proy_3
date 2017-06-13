'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var usuario_schema = schema({
	nombre: { type: String, unique: true },
	apellido: String,
	email: String,
	password: String,
	role: String,
	imagen: String
});

var usuario = mongoose.model('usuario',usuario_schema);

module.exports = usuario;