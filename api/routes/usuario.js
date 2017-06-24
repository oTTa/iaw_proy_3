'use strict'

var express = require('express');
var usuario_controller = require('../controllers/usuario');

var api = express.Router();
var md_auth = require('../middlewares/autenticar');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './imagenes/usuarios'})


api.post('/usuarios',usuario_controller.registrar);
api.post('/usuarios/login',usuario_controller.login);
api.post('/usuarios/:id/subir_imagen',[md_auth.autenticar_usuario, md_upload], usuario_controller.subir_imagen);
api.get('/usuarios/:id/imagen_perfil', usuario_controller.get_imagen);
api.get('/usuarios/:email',usuario_controller.get_usuario);
api.put('/usuarios/:id',md_auth.autenticar_usuario,usuario_controller.actualizar);

module.exports = api;