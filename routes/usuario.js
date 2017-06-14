'use strict'

var express = require('express');
var usuario_controller = require('../controllers/usuario');

var api = express.Router();
var md_auth = require('../middlewares/autenticar');

api.post('/usuarios',usuario_controller.registrar);
api.post('/usuarios/login',usuario_controller.login);
api.get('/usuarios/pruebas',md_auth.autenticar_usuario,usuario_controller.pruebas);
api.put('/usuarios/:id',md_auth.autenticar_usuario,usuario_controller.actualizar);

module.exports = api;