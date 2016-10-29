"use strict";

require('../lib/mongoConnection');
require('../models/Anuncio');
require('../models/Usuario');

var mongoose = require('mongoose');
var Admin = mongoose.mongo.Admin;
var db = mongoose.connection;
var Anuncio = mongoose.model('Anuncio');
var Usuario = mongoose.model('Usuario');

// Elimino las collections 'anuncios' y 'usuarios' si ya existen


db.collections['anuncios'].drop( function(err) {
    if(err){
        //console.log(err);
        return;
    }
    console.log('Anuncios collection borrada');
});

db.collections['usuarios'].drop( function (err) {
    if (err) {
        //console.log(err);
        return;
    }
    console.log('Usuarios collection borrada');
});

var json = require('./anuncios.json');

Anuncio.collection.insertMany(json.anuncios, function (err, r) {
    if (err) {
        console.log("Error:", err);
        return;
    }
    console.log('Creada colección anuncios');
});

json = require('./usuarios.json');

Usuario.collection.insertMany(json.usuarios, function (err, r) {
    if (err) {
        console.log("Error:", err);
        return;
    }
    console.log('Creada colección usuarios');
});

db.close();