'use strict'

var express = require('express');
var body_parser = require('body-parser');

var app = express();

//cargar rutas
var usuarios_routes = require('./routes/usuario');
var destinos_routes = require('./routes/destino');
var paquetes_routes = require('./routes/paquete');


app.use(body_parser.urlencoded({extended:false}));
app.use(body_parser.json());

//configurar cabeceras http

//rutas base
app.use('/api', usuarios_routes);
app.use('/api', destinos_routes);
app.use('/api', paquetes_routes);

module.exports = app;