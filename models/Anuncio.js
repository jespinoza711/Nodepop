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

anuncioSchema.statics.list = function(filter, sort, start, limit, cb) {
    var query = Anuncio.find(filter);

    query.sort(sort);
    query.skip(start);
    query.limit(limit);

    query.exec(cb);
}

var Anuncio = mongoose.model('Anuncio', anuncioSchema);