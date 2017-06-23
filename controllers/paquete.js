'use strict'

const Paquete = require('../models/paquete');
const validator = require('validator');
const trim = require('trim');
const paginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');
const dir_image = "./imagenes/paquetes";

function crear(req, res){

	var paquete = new Paquete();

	var params = req.body;
	
	if (checkData(params,res)){

		if (typeof params.url_video !== 'undefined'){
			paquete.url_video = trim(params.url_video);
		}

		paquete.fecha_salida = params.fecha_salida;
		paquete.fecha_regreso = params.fecha_regreso;
		paquete.costo = params.costo;
		paquete.destino = params.destino;
		paquete.descripcion = trim(params.descripcion);

		paquete.save((err,paquete_store) =>{
			if (err){
				res.status('500').send({
					message : 'Error al guardar el paquete.'
				});
			}
			else{
				if (paquete_store){
					res.status('201').send({
						paquete : paquete_store
					});
				}
				else{
					res.status('500').send({
						message : 'No se pudo guardar el paquete.',
					});
				}
			}
		});				
	}
}

function checkData(paquete, res){

	if (paquete.fecha_salida==null || validator.isEmpty(paquete.fecha_salida))
	{
		res.status('400').send({
			message : 'Debes ingresar una fecha de salida.'
		});
		return false;
	}

	if (!validator.isISO8601(paquete.fecha_salida))
	{
		res.status('400').send({
			message : 'Formato invalido de la fecha de salida, debe ser de la forma yyyy/mm/dd.'
		});
		return false;
	}

	if (paquete.fecha_regreso==null || validator.isEmpty(paquete.fecha_regreso))
	{
		res.status('400').send({
			message : 'Debes ingresar una fecha de regreso.'
		});
		return false;
	}

	if (!validator.isISO8601(paquete.fecha_regreso))
	{
		res.status('400').send({
			message : 'Formato invalido de la fecha de regreso, debe ser de la forma yyyy/mm/dd.'
		});
		return false;
	}
	
	if (paquete.costo==null || validator.isEmpty(paquete.costo.toString()))
	{
		res.status('400').send({
			message : 'Debes ingresar un costo en AR$ para el paquete.'
		});
		return false;
	}

	if (!validator.isInt(paquete.costo.toString()))
	{
		res.status('400').send({
			message : 'El costo debe ser un entero.'
		});
		return false;
	}
	

	if (paquete.descripcion==null || validator.isEmpty(paquete.descripcion))
	{
		res.status('400').send({
			message : 'Debes ingresar una descripción'
		});
		return false;
	}

	if (paquete.destino==null || validator.isEmpty(paquete.destino))
	{
		res.status('400').send({
			message : 'Debes ingresar un destino.'
		});
		return false;
	}

	/*if (!validator.isMongoId('paquete.destino'))
	{
		res.status('400').send({
			message : 'El ID destino no tiene el formato correcto.'
		});
		return false;
	}*/

	if (typeof paquete.url_video !== 'undefined'){
			if (!validator.isURL(paquete.url_video))
			{
				res.status('400').send({
					message : 'La URL no tiene el formato corrrecto.'
				});
				return false;
			}
	}

	return true;
}

function get(req, res){

	Paquete.findById(req.params.id).populate('destino').exec( (err, paquete) => {
		if (err){
			res.status('500').send({
				message : 'Error en la petición get.'
			});
		}
		else{
			if (!paquete){
				res.status('404').send({
					message : 'No existe el paquete.'
				});
			}
			else{
				res.status('200').send({
					paquete
				});
			}
		}
	});
}

function listar(req, res){
	var pag
	if (req.query.page)
		pag = req.query.page;
	else
		pag = 1;

	if (pag<1)
	{
		return res.status(400).send({message : "la pagina debe ser mayor a 0"});
	}

	var items_por_pag = 20;

	Paquete.find().populate('destino').paginate(pag, items_por_pag, function(err, paquetes, total){
		if (err){
			return res.status(500).send({message : "error en la petición listar"});
		}
		else
		{
			if(!paquetes){
				return res.status(404).send({message: 'No hay paquetes'})
			}
			else{
				var sig, ant;

				if (pag == Math.ceil(total/items_por_pag))
					sig=null;
				else
					sig=parseInt(pag)+1;

				if (pag==1)
					ant=null;
				else
					ant=parseInt(pag)-1;
				return res.status(200).send({
					header: {
						paginas: Math.ceil(total/items_por_pag),
						total: total,
						siguiente: sig,
						anterior: ant
					},					
					paquetes: paquetes
				});
			}
		}
	});

}

function editar(req, res){
	var id_paquete = req.params.id;
	var update = req.body;

	check_data_update (update);

	Paquete.findByIdAndUpdate(id_paquete, update,  {new: true}, (err, destino_updated) => {
		if (err){
			return res.status(500).send({message:'Error al actulizar el destino.'});
		}
		else{
			if (!destino_updated){
				return res.status(404).send({message:'No se pudo actualizar el destino.'});
			}
			else{
				return res.status(200).send({usuario: destino_updated});
			}
		}
	});

}

function check_data_update (data){
	if (typeof data.fecha_salida !== 'undefined'){
		if (!validator.isISO8601(data.fecha_salida))
		{
			res.status('400').send({
				message : 'Formato invalido de la fecha de salida, debe ser de la forma yyyy/mm/dd.'
			});
			return false;
		}
	}

	if (typeof data.fecha_regreso !== 'undefined'){
		if (!validator.isISO8601(data.fecha_regreso))
		{
			res.status('400').send({
				message : 'Formato invalido de la fecha de regreso, debe ser de la forma yyyy/mm/dd.'
			});
			return false;
		}
	}

	if (typeof data.fecha_regreso !== 'undefined'){
		if (!validator.isISO8601(data.fecha_regreso))
		{
			res.status('400').send({
				message : 'Formato invalido de la fecha de regreso, debe ser de la forma yyyy/mm/dd.'
			});
			return false;
		}
	}

	if (typeof data.costo !== 'undefined'){
		if (!validator.isInt(data.costo.toString()))
		{
			res.status('400').send({
				message : 'El costo debe ser un entero.'
			});
			return false;
		}
	}

	if (data.destino==null || validator.isEmpty(data.destino))
	{
		res.status('400').send({
			message : 'Debes ingresar un destino.'
		});
		return false;
	}

	if (typeof data.url_video !== 'undefined'){
		if (!validator.isURL(data.url_video))
			{
				res.status('400').send({
					message : 'La URL no tiene el formato corrrecto.'
				});
				return false;
			}
	}
	return true;
}

module.exports = {
	crear,
	editar,
	get,
	listar
};