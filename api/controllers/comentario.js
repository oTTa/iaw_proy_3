'use strict'

const Comentario = require('../models/comentario');
const Paquete = require('../models/paquete');
const Usuario = require('../models/usuario');

const validator = require('validator');
const trim = require('trim');
const paginate = require('mongoose-pagination');

function comentar(req, res){

	var comentario = new Comentario();

	var params = req.body;

	if (checkData(params,res)){

		comentario.contenido = trim(params.contenido);
		comentario.paquete = req.params.id_paquete;
		comentario.usuario = req.user.sub;
		comentario.fecha = new Date();

		Paquete.findById({_id: comentario.paquete}, (err, paquete) => {
			if (err){
				res.status('500').send({
					message : 'Error en la petición con el paquete. ' 
				});
			}
			else{
				if (!paquete){
					res.status('404').send({
						message : 'No existe el paquete.'
					});
				}
			}
		});

		Usuario.findById({_id: comentario.usuario}, (err, usuario) => {
			if (err){
				res.status('500').send({
					message : 'Error en la petición con el usuario. ' 
				});
			}
			else{
				if (!usuario){
					res.status('404').send({
						message : 'No existe el usuario.'
					});
				}
			}
		});
 
		comentario.save((err,comentario_store) =>{
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

	if (comentario.contenido==null || validator.isEmpty(comentario.contenido))
	{
		res.status('400').send({
			message : 'Debes ingresar un contenido en el comentario.'
		});
		return false;
	}
	return true;
}

function listar (req, res){

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

	Comentario.find({paquete: req.params.id_paquete}).populate('usuario', 'nombre apellido imagen email').paginate(pag, items_por_pag, function(err, comentarios, total){
		if (err){
			return res.status(500).send({message : "error en la petición listar"});
		}
		else
		{
			if(!comentarios){
				return res.status(404).send({message: 'No hay comentarios'})
			}
			else{
				var sig, ant;

				if (pag == Math.ceil(total/items_por_pag) || 0 == Math.ceil(total/items_por_pag))
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
					comentarios: comentarios
				});
			}
		}
	});

}

module.exports = {
	comentar,
	listar
};