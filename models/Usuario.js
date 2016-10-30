"use strict";

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Definición Esquema de Anuncio
var usuarioSchema = mongoose.Schema({
    nombre: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    clave: { type: String, required: true }
});

usuarioSchema.methods.comparePassword = function(claveToCheck, hash, cb) {
    bcrypt.compare(claveToCheck, hash, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

var Usuario = mongoose.model('Usuario', usuarioSchema);