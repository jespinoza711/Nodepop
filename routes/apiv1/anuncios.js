"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

var jwtAuth = require('../../lib/jwtAuth');

router.use(jwtAuth());

router.get('/', function(req, res, next) {
     var includeTotal = req.query.includeTotal || false;
     var limit = parseInt(req.query.limit) || null;
     var nombre = req.query.nombre;
     var precio = req.query.precio;
     var sort = req.query.sort || null;
     var start = parseInt(req.query.start - 1) || 0;
     var tag = req.query.tag;
     var venta = req.query.venta;


    var filter = {};

    if(typeof nombre !== 'undefined') {
        filter.nombre = new RegExp('^' + req.query.nombre, "i");
    }

    if(typeof precio !== 'undefined') {
        var maxMin = precio.split("-");

        if( maxMin.length === 1 && maxMin[0] !== '' && !isNaN(maxMin[0]) ){
            filter.precio = maxMin[0];
        }else{
            var min = maxMin[0];
            var max = maxMin[1];

            if( min === '' && !isNaN(max)) {
                filter.precio = {$lt: max };
            }else if( max === '' && !isNaN(min)) {
                filter.precio = {$gt: min };
            } else {
                if( !isNaN(min) && !isNaN(max) ){
                    filter.precio = {$gt: min, $lt: max};
                }

            }
        }

    }

    if(typeof tag !== 'undefined') {
        if( tag.constructor === Array) {
            filter.tags = { $in : tag };
        }else{
            filter.tags = { $in : [ tag ] };
        }
    }

    if(typeof venta !== 'undefined'){
        filter.venta = venta;
    }

    Anuncio.list(filter, sort, start, limit,function (err, anuncios) {
        if(err){
            next(err);
            return;
        }
        if( includeTotal){
            res.json({success: true, total: anuncios.length, anuncios: anuncios});
        }else{
            res.json({success: true, anuncios: anuncios});
        }
    });
});

module.exports = router;