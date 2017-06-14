'use strict'

var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');
var bcrypt = require('bcrypt-nodejs');
var validator = require('validator');
var trim = require('trim');


function pruebas (req, res){
	res.status('200').send({
		message: 'metodo para pruebas' 
	});

}

function registrar(req, res){

	var usuario = new Usuario();

	var params = req.body;
	//console.log(params);
	
	if (checkData(params,res)){

		usuario.nombre = trim(params.nombre.toLowerCase());
		usuario.apellido = trim(params.apellido.toLowerCase());
		usuario.email = trim(params.email);
		usuario.role = 'ROLE_USER';
		usuario.image = null;

		if (params.password){
			bcrypt.hash(params.password,null,null, function(err,hash){
				usuario.password = hash;
				usuario.save((err,usuario_store) =>{
						if (err){
							res.status('409').send({
								message : 'Ya existe un usuario con ese email.'
							});
						}
						else{
							if (usuario_store){
								res.status('201').send({
									message : 'Usuario guardado correctamente',
									usuario : usuario_store
								});
							}
							else{
								res.status('500').send({
									message : 'Error al guardar el usuario en la BD.',
									usuario : usuario_store
								});
							}
						}
				});				
			});
		}
		else{
			res.status('400').send({
				message : 'Debes ingresar una contraseña.'
			});
		}
	}
}

function checkData(usuario, res){

	if (usuario.nombre==null || validator.isEmpty(usuario.nombre))
	{
		res.status('400').send({
			message : 'Debes ingresar una nombre.'
		});
		return false;
	}
	if (usuario.apellido==null || validator.isEmpty(usuario.apellido))
	{
		res.status('400').send({
			message : 'Debes ingresar un apellido.'
		});
		return false;
	}
	if (usuario.email==null || validator.isEmpty(usuario.email))
	{
		res.status('400').send({
			message : 'Debes ingresar un email.'
		});
		return false;
	}
	if (!validator.isEmail(usuario.email))
	{
		res.status('400').send({
			message : 'El formato del email es invalido.'
		});
		return false;
	}
	return true;

}

function login (req, res){
	var params = req.body;

	if (check_login(params, res)){

		var email = trim(params.email);
		var password = trim(params.password);

		Usuario.findOne({email: email}, (err, user) => {
			if (err){
				res.status('500').send({
					message : 'Error en la petición.'
				});
			}
			else{
				if (!user){
					res.status('404').send({
						message : 'No existe el usuario.'
					});
				}
				else{
					bcrypt.compare(password,user.password, function (err, check){
						if (check){
								res.status('200').send({
									token: jwt.crear_token(user)
								});
						}
						else{
							res.status('401').send({
								message : 'Contraseña invalida.'
							});
						}
					});
				}
			}
		});

	}

}

function check_login (params, res){
	if (params.email==null || validator.isEmpty(params.email)){
		res.status('400').send({
			message : 'Debes ingresar un email.'
		});
		return false;
	}

	if (params.password==null || validator.isEmpty(params.password)){
		res.status('400').send({
			message : 'Debes ingresar una constraseña.'
		});
		return false;
	}

	if (!validator.isEmail(params.email))
	{
		res.status('400').send({
			message : 'El formato del email es invalido.'
		});
		return false;
	}
	return true;
}

module.exports = {
	registrar,
	login,
	pruebas
};