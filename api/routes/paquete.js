'use strict'

var express = require('express');
var paquete_controller = require('../controllers/paquete');

var api = express.Router();
var md_auth = require('../middlewares/autenticar');
var md_admin = require('../middlewares/is_admin');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './imagenes/paquetes'})


api.post('/paquetes',md_admin.autenticar_admin,paquete_controller.crear);
api.get('/paquetes/:id',paquete_controller.get);
api.delete('/paquetes/:id',md_admin.autenticar_admin,paquete_controller.borrar);
api.put('/paquetes/:id',md_admin.autenticar_admin,paquete_controller.editar);
api.get('/paquetes',paquete_controller.listar);
api.post('/paquetes/:id/subir_imagen',[md_admin.autenticar_admin, md_upload], paquete_controller.subir_imagen);
api.get('/paquetes/:id/imagenes', paquete_controller.get_imagenes);
api.get('/destinos/:id_destino/paquetes', paquete_controller.listar_paquetes_destino);
api.get('/paquetes/:id/imagenes/:id_imagen', paquete_controller.get_imagen);
api.delete('/paquetes/:id/imagenes/:id_imagen',md_admin.autenticar_admin,paquete_controller.borrar_imagen);
api.get('/paquetes/:id/imagenes/:id_imagen/thumb', paquete_controller.get_imagen_thumb);


module.exports = api;