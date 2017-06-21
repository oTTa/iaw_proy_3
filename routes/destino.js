'use strict'

var express = require('express');
var destino_controller = require('../controllers/destino');

var api = express.Router();
var md_auth = require('../middlewares/autenticar');

api.post('/destinos',md_auth.autenticar_usuario,destino_controller.crear);
api.get('/destinos/listar/:page',destino_controller.listar);
api.get('/destinos/:id',destino_controller.get);

module.exports = api;