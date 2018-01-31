var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var mongo = require('mongodb');

// var db = require('monk')('ds217898.mlab.com:17898/nerdtalk');
// var db = require('monk')('mongodb://admin:admin123@ds217898.mlab.com:17898/nerdtalk');
var db = require('monk')('localhost/nerdtalk');

var multer = require('multer');
var flash = require('connect-flash');

var routes = require('./routes/index');
var posts = require('./routes/posts');
var categories = require('./routes/categories');

var app = express(),
    passport = require('passport'),
    auth = require('./auth'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session');

auth(passport);
app.use(passport.initialize());

app.use(cookieSession({
    name: 'session',
    keys: ['SECRECT KEY'],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(cookieParser());
passport.serializeUser(function(user, done) {
  // placeholder for custom user serialization
  // null is for errors
 
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // placeholder for custom user deserialization.
  // maybe you are getoing to get the user from mongo by id?
  // null is for errors
  done(null, user);
});

app.locals.moment = require('moment');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.locals.truncateText = function(text, length){
    var truncateText = text.substring(0,length);
    return truncateText;
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Handle file uploads
app.use(multer({ dest:'./public/images/uploads'}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  req.db =  db;
  next();
});

app.use('/', routes);
app.use('/posts', posts);
app.use('/categories', categories);
app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.profile.emails.read']
}));


app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
      var User = db.get('users');
        User.findOne({
        email:  req.user.profile.emails[0].value
      }, function(err, user) {
        if (err) return err;

        if (!user) {
          
          
  
        
        var profile=req.user.profile;
        var users = db.get('users');
        console.log(JSON.stringify(profile));
        var photo=profile.photos[0].value.split('?')[0];
        // Submit to db
        users.insert({
            "name": profile.displayName,
            "email": profile.emails[0].value,
            "photo": photo,
            "client": profile.provider,
            "followers":[],
            "following":[]
        }, function(err, user){
            if(err){
                res.send('There was an signingup');
            } else {
                req.flash('success', 'Login Succesful'+JSON.stringify(user));
               
            }
        });
		      
          
        }
        
         req.session.token = req.user.token;
           res.location('/');
           res.redirect('/');
        
        
        
       })
        
        
        
       
		
		
        //console.log(JSON.stringify(req.user));
        //res.redirect('/check');
    }
);

app.get('/check', (req, res) => {
    if (req.session.token) {
        res.cookie('token', req.session.token);
        
        res.json({
            status: 'session cookie set',
            user: req.user
        });
    } else {
        res.cookie('token', '')
        res.json({
            status: 'session cookie not set',
        });
    }
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/login');
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

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

process.env.HTTPS_PROXY = 'http://172.16.2.30:8080';
process.env.HTTP_PROXY = 'http://172.16.2.30:8080';

module.exports = app;
