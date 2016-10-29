"use strict";

var mongoose = require('mongoose');

// Definición Esquema de Anuncio
var usuarioSchema = mongoose.Schema({
    nombre: String,
    email: String,
    clave: String,
});

var Usuario = mongoose.model('Usuario', usuarioSchema);