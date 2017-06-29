'use strict'

var express = require('express');
var destino_controller = require('../controllers/destino');

var api = express.Router();
var md_auth = require('../middlewares/autenticar');
var md_admin = require('../middlewares/is_admin');

api.post('/destinos',md_admin.autenticar_admin,destino_controller.crear);
api.put('/destinos/:id',md_admin.autenticar_admin,destino_controller.editar);
api.get('/destinos',destino_controller.listar);
api.get('/destinos/:id',destino_controller.get);
api.delete('/destinos/:id',md_admin.autenticar_admin,destino_controller.borrar);

module.exports = api;