const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const lessMiddleware = require('less-middleware');
const debug = require('debug');

const flash = require('connect-flash');
// DB Module
const { initDb } = require('./config/db');
// passport module
const auth = require('./config/passport');
/*
  === Local Variables ===
*/
// Express Session Option Object
const sessionOpts = {
  saveUninitialized: true, // save new sessions
  secret: 'Phil is cool...duh',
  resave: false, // do not automatically write to the session store
  cookie: { httpOnly: true, maxAge: 24192000000 },
};
// Binding debug's output to the console.
// Initializing Loggers
debug.log = console.log.bind(console);
const log = debug('guess:app');
const error = debug('guess: error');
// Router declaration
const indexRouter = require('./routes/index.js');
const authRouter = require('./routes/auth.js');

let passport;

/*
  === Function Definitions ===
*/
function errorHandler(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}
const app = express();
/*
  === Main Logic ===
*/
(async function () {
  try {
    await initDb();

    log('PAF Guessing Game Application started...');
    // view engine setup
    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'pug');
    app.use(logger('dev'));
    app.use(cookieParser(sessionOpts.secret));
    app.use(
      lessMiddleware('/stylesheets/less', {
        dest: '/stylesheets/css',
        pathRoot: path.join(__dirname, '/public'),
        compress: true,
        force: true,
        debug: true,
      })
    );
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.static(path.join(__dirname, '/routes')));
    app.use(session(sessionOpts));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    passport = auth.initialize();
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    // Set Routers
    app.use('/', indexRouter);
    app.use('/auth', authRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(errorHandler);
  } catch (err) {
    error(err.stack);
  }
})();
module.exports = app;
