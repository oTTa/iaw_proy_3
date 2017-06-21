'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "f051b599d0437e00e0ee88768f5ec697:$¿?·?$_+-"

exports.autenticar_usuario = function (req, res, next){
	if (!req.headers.authorization){
		return res.status(403).send({
			message: 'Falta la cabecera de autenticación'});
	}

	var token = req.headers.authorization.replace(/["']+/g, '');

	try {
		var payload = jwt.decode(token, secret);
		if (payload.exp <= moment.unix()){
			return res.status(401).send({
			message: 'Token expirado'});
		}

	}
	catch(ex){
		//console.log(ex);
		return res.status(401).send({
			message: 'Token invalido'});
	}

	req.user = payload;

	next();
}