'use strict'

var express = require('express');
var body_parser = require('body-parser');

var app = express();

//cargar rutas
var usuarios_routes = require('./routes/usuario');
var destinos_routes = require('./routes/destino');
var paquetes_routes = require('./routes/paquete');
var comentarios_routes = require('./routes/comentario');


app.use(body_parser.urlencoded({extended:false}));
app.use(body_parser.json());

//configurar cabeceras http

app.use((req, res, next) =>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Method', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();

});

//rutas base
app.use('/api', usuarios_routes);
app.use('/api', destinos_routes);
app.use('/api', paquetes_routes);
app.use('/api', comentarios_routes);


module.exports = app;