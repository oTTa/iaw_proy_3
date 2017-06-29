'use strict'

const Paquete = require('../models/paquete');
const Destino = require('../models/destino');
const Imagen_paquete = require('../models/imagen_paquete');
const validator = require('validator');
const trim = require('trim');
const paginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');
const dir_image = "./imagenes/paquetes/";
var thumb = require('node-thumbnail').thumb;

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

	Destino.findById(paquete.destino, (err, dest) => {
		if (err){
			res.status('500').send({
				message : 'Error en la petición.'
			});
		}
		else{
			console.log(paquete.destino);
			console.log(dest);
			if (!dest){
				res.status('404').send({
					message : 'No existe el destino.'
				});
			}
		}
	});

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

function get_imagenes(req, res){
		Imagen_paquete.find({paquete: req.params.id}).exec( (err, imagenes) => {
					if (err){
						res.status('500').send({
							message : 'Error en la petición imagenes.'
						});
					}
					else{
						if (imagenes){
							console.log(imagenes);
							return res.status('200').send({
								imagenes
							});

						}
					}
	});
}

function get_imagen(req, res){
		Imagen_paquete.findById(req.params.id_imagen).exec( (err, imagen) => {
					if (err){
						res.status('500').send({
							message : 'Error en la petición imagenes.'
						});
					}
					else{
						if (imagen){
								var path_file = dir_image+imagen.imagen;
								console.log(dir_image+imagen.imagen);
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
	});
}


function get_imagen_thumb(req, res){
		Imagen_paquete.findById(req.params.id_imagen).exec( (err, imagen) => {
					if (err){
						res.status('500').send({
							message : 'Error en la petición imagenes.'
						});
					}
					else{
						if (imagen){
								var path_file = dir_image+"thumb/"+imagen.imagen_thumbnail;
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

function listar_paquetes_destino(req, res){
	var pag
	if (req.query.page)
		pag = req.query.page;
	else
		pag = 1;

	if (pag<1)
	{
		return res.status(400).send({message : "la pagina debe ser mayor a 0"});
	}

	var id_destino = req.params.id_destino;

	var items_por_pag = 20;

	Paquete.find({"destino": id_destino}).populate('destino').paginate(pag, items_por_pag, function(err, paquetes, total){
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

	Paquete.findByIdAndUpdate(id_paquete, update,  {new: true})
	.populate('destino')
	.exec( function(err, destino_updated){
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

function subir_imagen (req, res){
	var id_paquete = req.params.id;

	Paquete.findById(id_paquete, (err, paq) => {
		if (err){
			res.status('500').send({
				message : 'Error en la petición.'
			});
		}
		else{
			if (!paq){
				res.status('404').send({
					message : 'No existe el paquete.'
				});
			}
		}
	});

	var file_name = null;
	if (req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		file_name = file_split[2];
		var extension = file_name.split('\.')[1];
		var name = file_name.split('\.')[0];
		if (extension=='jpg' || extension=='jpeg' || extension=='png'){

			var imagen_paquete = new Imagen_paquete();
			imagen_paquete.imagen = file_name;


			thumb({
			  source: file_path, 
			  destination: dir_image+"thumb/",
			  width: 350,

			}).then(function() {
			  //console.log('Success');
			}).catch(function(e) {
			  console.log('Error', e.toString());
			});

			

			imagen_paquete.imagen_thumbnail = name + '_thumb.' + extension;
			imagen_paquete.paquete = id_paquete;

			imagen_paquete.save((err,imagen_paquete_store) =>{
				if (err){
					res.status('500').send({
						message : 'Error al actualizar el paquete.'
					});
				}
				else{
					if (imagen_paquete_store){
						res.status('201').send({
							imagen_paquete : imagen_paquete_store
						});
					}
					else{
						res.status('500').send({
							message : 'No se pudo actualizar el paquete.',
						});
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

function borrar_imagen(req, res){
	Imagen_paquete.remove({_id: req.params.id_imagen}, (err, paquete) => {
		if (err){
			res.status('500').send({
				message : 'Error en la petición.'
			});
		}
		else{
			if (!paquete){
				res.status('404').send({
					message : 'No existe la imagen.'
				});
			}
			else{
				res.status('204').send({});
			}
		}
	});
}

function borrar(req, res){
	Paquete.remove({_id: req.params.id}, (err, paquete) => {
		if (err){
			res.status('500').send({
				message : 'Error en la petición.'
			});
		}
		else{
			if (!paquete){
				res.status('404').send({
					message : 'No existe el paquete.'
				});
			}
			else{
				res.status('204').send({});
			}
		}
	});
}

module.exports = {
	crear,
	editar,
	get,
	listar,
	subir_imagen,
	get_imagenes,
	get_imagen,
	get_imagen_thumb,
	listar_paquetes_destino,
	borrar,
	borrar_imagen
};