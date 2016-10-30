var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

require('./lib/mongoConnection');

// cargo los modelos
require('./models/Anuncio');
require('./models/Usuario');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));
app.use('/apiv1/usuarios', require('./routes/apiv1/usuarios'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var lang = req.query.lang || req.body.lang || req.headers['lang'] || 'en';

  if ( lang === 'es' ){
    var msgs = require('./i18n/apimsg_es.json');
  } else {
    var msgs = require('./i18n/apimsg_en.json')
  }

  var err = new Error('Not Found');
  err.status = 404;

  if(isAPI(req)){
    res.json({success:false, message: msgs.page_not_found});
  }else{
    next(err);
  }

});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    var lang = req.query.lang || req.body.lang || req.headers['lang'] || 'en';

    if ( lang === 'es' ){
      var msgs = require('./i18n/apimsg_es.json');
    } else {
      var msgs = require('./i18n/apimsg_en.json')
    }
    res.status(err.status || 500);

    if(isAPI(req)){
      res.json({success:false, message: msgs.error500});
    }else {
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var lang = req.query.lang || req.body.lang || req.headers['lang'] || 'en';

  if ( lang === 'es' ){
    var msgs = require('./i18n/apimsg_es.json');
  } else {
    var msgs = require('./i18n/apimsg_en.json')
  }

  res.status(err.status || 500);

  if(isAPI(req)){
    res.json({success:false, message: msgs.error500});
  }else {
    res.render('error', {
      message: err.message,
      error: {}
    });
  }
});

// Función para detectar si la petición es de API o es de web
function isAPI (req) {
  console.log('req.originalUrl: '+ req.originalUrl);
  return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
