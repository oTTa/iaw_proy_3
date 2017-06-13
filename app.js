'use strict'

var express = require('express');
var body_parser = require('body-parser');

var app = express();

//cargar rutas
var usuarios_routes = require('./routes/usuario');


app.use(body_parser.urlencoded({extended:false}));
app.use(body_parser.json());

//configurar cabeceras http

//rutas base
app.use('/api', usuarios_routes);

module.exports = app;