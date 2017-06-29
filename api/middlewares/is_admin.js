'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "f051b599d0437e00e0ee88768f5ec697:$¿?·?$_+-"

exports.autenticar_admin = function (req, res, next){
	if (!req.headers.authorization){
		return res.status(403).send({
			message: 'Falta la cabecera de autenticación'});
	}
	//por si el token es mandado entre comillas ""
	var token = req.headers.authorization.replace(/["']+/g, '');

	try {
		var payload = jwt.decode(token, secret);
		if (payload.exp <= moment.unix()){
			return res.status(401).send({
			message: 'Token expirado'});
		}
		if (payload.role !== "ROLE_ADMIN"){
			return res.status(401).send({
			message: 'No tienes permisos para realizar esta acción'});
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