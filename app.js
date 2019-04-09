const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
// const exphbs = require('handlebars');
const expressValidator = require('express-validator');
// const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
let exphbs = require('express-handlebars');
var helpers = require('handlebars-helpers');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
// mongoose.connect("mongodb://localhost:27017/User_Login_System").then(() => {
//   console.log('success to connect:DB')
// }).catch(() => {
//   console.log('failed to connect');

// });
//connect code in user Model

let hbs = exphbs.create({
  // Specify helpers which are only registered on this instance. 
  helpers: {
    foo: function () {
      return 'FOO!';
    },
    bar: function () {
      return 'BAR!';
    }
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(session({
  secret: 'mysecret',
  cookie: {
    maxAge: 60000
  }
}));

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// express session
app.use(passport.initialize());
app.use(passport.session());













//express message
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  next();
})

//express validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    const namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
  console.log('listen on 3000......');

})

module.exports = app;