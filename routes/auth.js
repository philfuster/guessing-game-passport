const express = require('express');

const router = express.Router();

const debug = require('debug');

const log = debug('guess:routes');

const bcrypt = require('bcrypt');

const saltRounds = 10;

const dateformat = require('dateformat');

const { ObjectID } = require('mongodb');

const url = require('url');

const { getDb, findByUsername, createUser } = require('../config/db');

const config = require('../config/config');

const { getPassport } = require('../config/passport');

const passport = getPassport();

const { routes, views, title } = config;

// === Local Variable Defs ===
const lengthReq = /.{8,}/m;
const numberReq = /\d{1,}/m;
const uppercaseReq = /[A-Z]/m;
const specialCharReq = /[-\/=\\#^$*+?.()|[\]{}]/m;

// === Local Function Defs ===
/**
 *
 * @param {string} password - password to validate
 * @returns true if password is valid, false if not
 */
function validatePasswordReqs(password) {
  // Guilty until proven innocent
  let inputRejected = true;
  // If any of the password Requirements are not met break.
  switch (false) {
    case lengthReq.test(password):
      break;
    case numberReq.test(password):
      break;
    case uppercaseReq.test(password):
      break;
    case specialCharReq.test(password):
      break;
    default:
      inputRejected = false;
      break;
  }
  return !inputRejected;
}
/**
 * GET Login Form
 */
router.get('/login', function (req, res) {
  log('We trying to login real quick dawg...');
  res.render(views.login, { title, err: req.flash('error') });
});

/**
 * POST Login
 */
router.post(
  '/login',
  passport.authenticate('local', {
    session: true,
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: true,
  }),
  function (req, res) {
    log('User logged in...');
    res.render(views.index, { title });
  }
);

/**
 * GET Logout
 */
router.get('/logout', function (req, res) {
  if (req.user) {
    req.logout();
    log('trying to logout rn');
    res.redirect('/auth/login');
  }
});

/**
 * GET signup Form
 */
router.get('/signup', function (req, res) {
  log('We getting signup form real quick dawg...');
  // haha could be more errors we can make with req.flash
  res.render(views.signup, { title, err: req.flash('error') });
});

/**
 * Post Signup Form
 */
router.post('/signup', async function (req, res) {
  // is username taken?
  log('Posting signup');
  const { username, password, confirmPassword } = req.body;
  const model = {};
  const messages = [];
  model.title = title;
  let inputRejected = false;
  try {
    const foundUser = await findByUsername(username);
    if (foundUser) {
      messages.push('Username already taken');
      inputRejected = true;
    }
  } catch (err) {
    log(err);
  }
  // Confirm passwords match
  if (password.localeCompare(confirmPassword) !== 0) {
    messages.push('Passwords must match.');
    inputRejected = true;
  }
  // Confirm password meets requirements
  if (!validatePasswordReqs(password)) {
    messages.push('Password does not meet requirements');
    inputRejected = true;
  }
  //
  model.err = messages;
  if (inputRejected) {
    res.render(views.signup, model);
  } else {
    // write new user to DB and ish
    const date = dateformat();
    const today = dateformat(date, 'mmm dd yyyy HH:MM:ss');
    const hashedPw = await bcrypt.hash(password, saltRounds);
    const newUser = { username, hashedPw, date_created: today };
    await createUser(newUser);
    res.render(views.login, {
      message: 'Succesful Signup! Please login to confirm.',
    });
  }
});

module.exports = router;
