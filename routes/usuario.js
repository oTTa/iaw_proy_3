'use strict'

var express = require('express');
var usuario_controller = require('../controllers/usuario');

var api = express.Router();

api.post('/usuarios',usuario_controller.registrar);
api.post('/usuarios/login',usuario_controller.login);

module.exports = api;