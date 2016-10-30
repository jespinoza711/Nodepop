"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

router.get('/', function(req, res, next) {
    var includeTotal = req.query.includeTotal || false;
    var limit = parseInt(req.query.limit) || null;
    var nombre = req.query.nombre;
    var precio = req.query.precio;
    var sort = req.query.sort || null;
    var start = parseInt(req.query.start - 1) || 0;
    var tag = req.query.tag;
    var venta = req.query.venta;

    console.log('Tags:',tag);

    var filter = {};

    if(typeof nombre !== 'undefined') {
        filter.nombre = new RegExp('^' + req.query.nombre, "i");
    }

    if(typeof precio !== 'undefined') {
        var maxMin = precio.split("-");

        console.log('maxMin: ', maxMin);

        var min = maxMin[0];
        var max = maxMin[1];

        if( min === '' ) {
            filter.precio = {$lt: max };
        }else if( max === '') {
            filter.precio = {$gt: min };
        } else {
            filter.precio = {$gt: min, $lt: max};
        }
    }

    if(typeof tag !== 'undefined') {
        filter.tags = { $in : tag };
    }

    if(typeof venta !== 'undefined'){
        filter.venta = venta;
    }

    // filter = { precio: {$gt: 100, $lt: 500}};

    console.log('filter: ', filter);
// .find(filter).sort(sort).skip(start).limit(limit).exec

    Anuncio.list(filter, sort, start, limit,function (err, anuncios) {
        if(err){
            next(err);
            return;
        }
        if( includeTotal){
            console.log('IncludeTotal');
            res.json({success: true, total: anuncios.length, anuncios: anuncios});
        }else{
            console.log('No IncludeTotal');
            res.json({success: true, anuncios: anuncios});
        }
    });
});

module.exports = router;