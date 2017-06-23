'use strict'

const Comentario = require('../models/comentario');
const validator = require('validator');
const trim = require('trim');
const paginate = require('mongoose-pagination');

function comentar(req, res){

	var comentario = new Comentario();

	var params = req.body;
	console.log(req.user);
	return true;
	if (checkData(params,res)){

		comentario.contenido = trim(params.contenido);
		comentario.paquete = params.paquete;
		comentario.usuario = params.usuario;
		comentario.fecha = new Date();


		paquete.save((err,comentario_store) =>{
			if (err){
				res.status('500').send({
					message : 'Error al guardar el comentario.'
				});
			}
			else{
				if (comentario_store){
					res.status('201').send({
						comentario : comentario_store
					});
				}
				else{
					res.status('500').send({
						message : 'No se pudo guardar el comentario.',
					});
				}
			}
		});				
	}
}

function checkData(comentario, res){

	if (paquete.contenido==null || validator.isEmpty(paquete.contenido))
	{
		res.status('400').send({
			message : 'Debes ingresar un contenido en el comentario.'
		});
		return false;
	}


	if (comentario.paquete==null || validator.isEmpty(comentario.paquete))
	{
		res.status('400').send({
			message : 'Debes ingresar un paquete.'
		});
		return false;
	}

	if (comentario.usuario==null || validator.isEmpty(comentario.usuario))
	{
		res.status('400').send({
			message : 'Debes ingresar un usuario.'
		});
		return false;
	}
	return true;
}

module.exports = {
	comentar
};