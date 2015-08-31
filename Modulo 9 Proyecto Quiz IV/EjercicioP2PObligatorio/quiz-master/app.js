var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// uncomment after placing your favicon in /public

app.use(methodOverride('_method'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

// Auto logout

app.use(function (req, res, next) {
    if (!req.path.match(/\/login|\/logout/)) {
        if (req.session.user) { // Comprobamos si hay inicio de sesion
            var hora_inicial = new Date().getTime(); // Consultamos la hora inicial del inicio de sesion
            var ultimo_acceso = req.session.user.lastAccess || hora_inicial; // Consultamos la hora del último acceso 
            var tiempo_limite = hora_inicial - (2 * 60 * 1000); // Limitamos el tiempo de la sesion a dos minutos
            if (ultimo_acceso < tiempo_limite) { // Comparamos si han pasado los dos minutos desde el ultimo acceso a la página
                var sessionController = require('./controllers/session_controller');
                sessionController.destroy(req, res, next); // Borramos la sesion 
                return;
            }
            req.session.user.lastAccess = hora_inicial;
        }
    }
    res.locals.session = req.session;
    next();
})


// Helpers dinamicos:

app.use(function(req, res, next){

    //guardar path en session.redir para despues login
    if (!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
    }

    // hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err, 
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;