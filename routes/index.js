var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nerdtalk');


router.get('/', ensureAuthenticated, function(req, res, next) {
  var sess = req.session;
  var db = req.db;
  var users = db.get('users');
  var email = req.session.passport.user.profile.emails[0].value;
  console.log(email);
  users.find({ email: email }, {},function(err, user) {
    if (err) {
      res.send('There was an error');
    }
    else {
      var posts = user[0].posts;
      console.log(user);
      console.log(posts);
       res.render('index', {
      "user": user[0]
    });

    }


  });
});


router.get('/profile/:id', function(req, res, next) {

    var users = db.get('users');

    users.findById(req.params.id, function(err, user){
      console.log(user);
        res.render('index',{
            "user": user
        });
    });
});


router.get('/login', function(req, res, next) {
  res.render('login', {
    "login": true
  })
});

function ensureAuthenticated(req, res, next) {
  if (req.session.passport.user !== undefined) { return next(); }
  else {
    res.redirect('/login');
  }
}

module.exports = router;
