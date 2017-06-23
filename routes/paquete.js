'use strict'

var express = require('express');
var paquete_controller = require('../controllers/paquete');

var api = express.Router();
var md_auth = require('../middlewares/autenticar');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './imagenes/paquetes'})


api.post('/paquetes',[md_auth.autenticar_usuario],paquete_controller.crear);
api.get('/paquetes/:id',paquete_controller.get);
api.put('/paquetes/:id',[md_auth.autenticar_usuario],paquete_controller.editar);
api.get('/paquetes',paquete_controller.listar);

module.exports = api;