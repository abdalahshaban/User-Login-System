const express = require('express');
const indexRouter = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;


let User = require('../models/user')

/* GET home page. */
indexRouter.get('/', ensureAuthenticated, function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

// indexRouter.post('/login', passport.authenticate('local', {
//   failureRedirect: '/login',
//   successRedirect: '/',
//   failureFlash: true
// }));

indexRouter.get('/login', function (req, res, next) {
  res.render('login');
});

indexRouter.get('/register', function (req, res, next) {
  res.render('register', {
    title: 'Express'
  });
});

//logout
indexRouter.get('/logout', (req, res, next) => {
  req.logOut();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
})


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
    // const { name, username } = req.body;
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
        req.flash('success_msg', 'You are registered and can log in')
        res.redirect('/login', );
      }
    })
  }

});

//local Strategy

passport.use(new localStrategy((username, password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return done(null, false, {
        message: 'no user found'
      });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        return done(null, user)
      } else {
        return done(null, false, {
          message: 'Wrong password'
        })
      }

    })

  })

}));

//

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user)
  })
});

//login post
indexRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

//Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'You are not authorized to view that page')
    res.redirect('/login')
  }
}



module.exports = indexRouter;