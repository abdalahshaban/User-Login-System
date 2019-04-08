var express = require('express');
var indexRouter = express.Router();


let User = require('../models/user')

/* GET home page. */
indexRouter.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

indexRouter.get('/login', function (req, res, next) {
  res.render('login');
});

indexRouter.get('/register', function (req, res, next) {
  res.render('register', {
    title: 'Express'
  });
});

//process register
indexRouter.post('/register', function (req, res, next) {
  const name = req.body.name
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const password2 = req.body.password2

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'email is required').notEmpty();
  req.checkBody('email', 'email must be valid').isEmail();
  req.checkBody('username', 'username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
  req.checkBody('password2', 'password do not match').equals(req.body.password);


  let errors = req.validationErrors();

  if (errors) {
    console.log(errors);

    res.render('register', {
      errors: errors
    })
  } else {
    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: password,
    });

    User.registerUser(newUser, (err, user) => {
      if (err) {
        throw err
      } else {
        console.log(user)
        req.flash('success_msg', 'You are registerd and can log in')
        res.redirect('/login');
      }
    })

  }

});


module.exports = indexRouter;