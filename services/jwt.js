'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "f051b599d0437e00e0ee88768f5ec697:$¿?·?$_+-"

exports.crear_token = function(user){
	var payload = {
		sub: user._id,
		nombre: user.nombre,
		apellido: user.apellido,
		email: user.email,
		role: user.role,
		imagen: user.imagen,
		iat: moment().unix(),
		exp: moment().add(12, 'hours').unix()
	};
	return jwt.encode(payload, secret);
};
