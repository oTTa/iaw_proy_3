'use strict'

const Usuario = require('../models/usuario');
const jwt = require('../services/jwt');
const bcrypt = require('bcrypt-nodejs');
const validator = require('validator');
const trim = require('trim');
const fs = require('fs');
const path = require('path');
const dir_image = "./uploads/users/";

function registrar(req, res){

	var usuario = new Usuario();

	var params = req.body;
	
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
									message : 'Error al guardar el usuario en la BD.'
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

function actualizar (req, res){

	var id_user = req.params.id;
	var update = req.body;

	check_data_update(update);

	Usuario.findByIdAndUpdate(id_user, update,  {new: true}, (err, userUpdated) => {
		if (err){
			return res.status(500).send({message:'Error al actulizar el usuario.'});
		}
		else{
			if (!userUpdated){
				return res.status(404).send({message:'No se pudo actualizar el usuario.'});
			}
			else{
				return res.status(200).send({usuario: userUpdated});
			}
		}
	});

}

function check_data_update (data){
	if (typeof data.nombre !== 'undefined'){
		data.nombre = trim(data.nombre.toLowerCase());
	}
	if (typeof data.apellido !== 'undefined'){
		data.apellido = trim(data.apellido.toLowerCase());
	}
	if (typeof data.mail !== 'undefined'){
		if (!validator.isEmail(usuario.email))
		{
			res.status('400').send({
				message : 'El formato del email es invalido.'
			});
			return false;
		}
		data.mail = trim(mail);
	}
	return true;
}

function get_usuario (req, res){
	var email = req.params.email;

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
				res.status('200').send({
					usuario: user
				});
			}
		}
	});

}

function subir_imagen (req, res){
	var user_id = req.params.id;
	var file_name = null;
	if (req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		file_name = file_split[2];
		var extension = file_name.split('\.')[1];
		if (extension=='jpg' || extension=='jpeg'){
			Usuario.findByIdAndUpdate(user_id, {imagen: file_name},{new: true}, (err, userUpdated) => {
				if (err){
					return res.status(500).send({message:'Error al actulizar el usuario.'});
				}
				else{
					if (!userUpdated){
						return res.status(404).send({message:'No se pudo actualizar el usuario.'});
					}
					else{
						return res.status(200).send({usuario: userUpdated});
					}
				}
			});
		}
		else
		{
			fs.unlinkSync(file_path);
			res.status(400).send({message: 'Formato invalido.'})
		}
	}else{
		res.status(200).send({message: 'La imagen no se subio.'})
	}
}

function get_imagen (req, res){
	var image_file;
	Usuario.findOne({_id: req.params.id}, (err, user) => {
		if (err){
			return res.status('500').send({
				message : 'Error en la petición.'
			});
		}
		else{
			if (!user){
				return res.status('404').send({
					message : 'No existe el usuario.'
				});
			}
			else{
				if (typeof user.imagen === 'undefined'){
					return res.status('404').send({
						message : 'El usuario no tiene foto de perfil.'
					});
				}
				else{
					var path_file = dir_image+user.imagen;
					fs.exists(path_file, function (exists){
						if (exists){
							return res.sendFile(path.resolve(path_file));
						}
						else{
							return res.status(400).send({message: 'La imagen no existe.'})
						}
					});
				}
			}
		}
	});
	

	

}

module.exports = {
	registrar,
	login,
	actualizar,
	get_usuario,
	subir_imagen,
	get_imagen
};