"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

router.post('/authenticate', function (req,res,next) {
    var userEmail = req.body.email;
    var userPass = req.body.clave;
    var lang = req.query.lang || req.body.lang || req.headers['lang'] || 'en';

    if ( lang === 'es' ){
        var msgs = require('../../i18n/apimsg_es.json');
    } else {
        var msgs = require('../../i18n/apimsg_en.json')
    }


    // Se busca el usuario en la base de datos
    Usuario.findOne({ email: userEmail }, function(err, usuario) {
        if (err){
            res.json({success: false, message: 'muy chungo'});
            return;
        }
        console.log("usuario:",usuario);
        // Se comprueba la contraseña
        if( usuario ){
            usuario.comparePassword(userPass, usuario.clave, function(err, isMatch) {
                if (err) {
                    next(err);
                    return;
                }

                if(isMatch) {
                    // Si las contraseñas coinciden se crea el token y se envía la salida
                    var token = jwt.sign({email: usuario.email}, 'bUmLXMnLX6WiCc', {
                        expiresIn: '1 day'
                    });

                    res.json({success:true, token: token});
                }else{
                    // Si no coinciden se carga un mensaje de error
                    res.json({success:false, message: msgs.failed_password});
                }
            });
        }else{
            res.json({sucess: false, message: "el mal se acerca"});
        }

    });
});

router.post('/register', function (req, res, next) {
    var usuario = new Usuario(req.body);
    var lang = req.query.lang || req.body.lang || req.headers['lang'] || 'en';

    if ( lang === 'es' ){
        var msgs = require('../../i18n/apimsg_es.json');
    } else {
        var msgs = require('../../i18n/apimsg_en.json')
    }

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(usuario.clave, salt, function(err, hash) {
            if(err) {

                next(err);
                return;
            }
            usuario.clave = hash;
            usuario.save(function (err, usuarioGuardado) {
                if (err) {
                    next(err);
                    res.json({success: false, message: msgs.failed_register});
                    return;
                }
                res.json({success: true, usuario: usuarioGuardado});
            });
        });
    });
});

module.exports = router;