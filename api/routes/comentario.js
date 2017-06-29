'use strict'

var express = require('express');
var comentario_controller = require('../controllers/comentario');

var api = express.Router();
var md_auth = require('../middlewares/autenticar');

api.post('/paquetes/:id_paquete/comentarios',md_auth.autenticar_usuario,comentario_controller.comentar);
api.get('/paquetes/:id_paquete/comentarios',comentario_controller.listar);


module.exports = api;