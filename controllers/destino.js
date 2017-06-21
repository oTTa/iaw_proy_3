'use strict'

//const Usuario = require('../models/usuario');
const Destino = require('../models/destino');
const validator = require('validator');
const trim = require('trim');
const paginate = require('mongoose-pagination');

function crear(req, res){

	var destino = new Destino();

	var params = req.body;
	
	if (checkData(params,res)){

		destino.nombre = trim(params.nombre.toLowerCase());
		destino.provincia = trim(params.provincia.toLowerCase());
		destino.pais = trim(params.pais.toLowerCase());
		destino.latitud = params.latitud;
		destino.longitud = params.longitud;

		destino.save((err,destino_store) =>{
			if (err){
				res.status('500').send({
					message : 'Error al guardar el destino.'
				});
			}
			else{
				if (destino_store){
					res.status('201').send({
						destino : destino_store
					});
				}
				else{
					res.status('500').send({
						message : 'No se pudo guardar el destino.',
					});
				}
			}
		});				
	}
}

function checkData(destino, res){

	if (destino.nombre==null || validator.isEmpty(destino.nombre))
	{
		res.status('400').send({
			message : 'Debes ingresar una nombre.'
		});
		return false;
	}
	
	if (destino.provincia==null || validator.isEmpty(destino.provincia))
	{
		res.status('400').send({
			message : 'Debes ingresar una ciudad.'
		});
		return false;
	}

	if (destino.pais==null || validator.isEmpty(destino.pais))
	{
		res.status('400').send({
			message : 'Debes ingresar un pais.'
		});
		return false;
	}

	if (destino.latitud==null || validator.isEmpty(destino.latitud.toString()))
	{
		res.status('400').send({
			message : 'Debes ingresar una latitud.'
		});
		return false;
	}

	if (destino.longitud==null || validator.isEmpty(destino.longitud.toString()))
	{
		res.status('400').send({
			message : 'Debes ingresar una longitud.'
		});
		return false;
	}

	if (!validator.isDecimal(destino.longitud.toString()))
	{
		res.status('400').send({
			message : 'La longitud debe ser decimal.'
		});
		return false;
	}

	if (!validator.isDecimal(destino.latitud.toString()))
	{
		res.status('400').send({
			message : 'La latitud debe ser decimal'
		});
		return false;
	}



	return true;

}

function get(req, res){

	Destino.findOne({_id: req.params.id}, (err, destino) => {
		if (err){
			res.status('500').send({
				message : 'Error en la petición.'
			});
		}
		else{
			if (!destino){
				res.status('404').send({
					message : 'No existe el destino.'
				});
			}
			else{
				res.status('200').send({
					destino
				});
			}
		}
	});
}

function listar(req, res){
	var pag = req.params.page;

	if (req.params.page==null || validator.isEmpty(req.params.page.toString()))
	{
		pag=1;
	}

	console.log('hola');
	console.log(pag);

	var items_por_pag = 3;

	Destino.find().paginate(pag, items_por_pag, function(err, destinos, total){
		if (err){
			return res.status(500).send({message : "error en la petición"});
		}
		else
		{
			if(!destinos){
				return res.status(404).send({message: 'No hay destinos'})
			}
			else{
				return res.status(200).send({
					pages: total,
					destinos: destinos
				});
			}
		}
	});
}

module.exports = {
	crear,
	get,
	listar
};