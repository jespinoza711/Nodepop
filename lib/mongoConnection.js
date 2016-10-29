"use strict";

var mongoose = require('mongoose');
var db = mongoose.connection;

// Asocio objeto Promise de Javascript a mongoose para que no de el warning
mongoose.Promise = global.Promise;

db.on('error', console.log.bind(console));

db.once('open', function () {
    console.log('Conectado a MongoDB');
});

mongoose.connect('mongodb://localhost:27017/nodepop');