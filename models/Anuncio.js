"use strict";

var mongoose = require('mongoose');

// Definición Esquema de Anuncio
var anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});

var Anuncio = mongoose.model('Anuncio', anuncioSchema);