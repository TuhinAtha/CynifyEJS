var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cynify');

//Models
require('./models/Dummy.js');
require('./cyn/auth/auth.model.js');
require('./cyn/ui/nav.model.js');


//Routes
var cynAuth = require('./cyn/auth/auth.route')(passport);
var routes = require('./routes/index');
var users = require('./routes/users');

var dummyRoute = require('./routes/dummy');

var cynUiNavRoute = require('./cyn/ui/nav.route.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
  secret: "secret"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//// Initialize Passport
var initPassport = require('./cyn/auth/passport-init');
initPassport(passport);

// app.use('/', routes);
app.use('/auth',cynAuth);
app.use('/users', users);
app.use('/api',function(req, res, next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.status(401).send();
  }
  
});
app.use('/api/dummy', dummyRoute);

app.use('/api/cyn/ui/nav', cynUiNavRoute);


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
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
