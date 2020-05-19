const express = require('express');

const router = express.Router();

const debug = require('debug');

const log = debug('guess:routes');

const dateformat = require('dateformat');

const { ObjectID } = require('mongodb');

const url = require('url');

const { getDb, findByUsername } = require('../config/db');

const config = require('../config/config');

const { getPassport } = require('../config/passport');

const passport = getPassport();

const { routes, views, title } = config;

// === Local Function Defs ===
function validatePasswordReqs(password) {
  const pattern = /\w{8,}\d{1,}[A-Z][-\/=\\#^$*+?.()|[\]{}]/gm;
  return pattern.test(password);
}
/**
 * GET Login Form
 */
router.get('/login', function (req, res) {
  log('We trying to login real quick dawg...');
  res.render(views.login, { title, message: req.flash('error') });
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
 * GET signup Form
 */
router.get('/signup', function (req, res) {
  log('We getting signup form real quick dawg...');
  // haha could be more errors we can make with req.flash
  res.render(views.signup, { title, message: req.flash('error') });
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
  model.message = messages;
  if (inputRejected) {
    res.render(views.signup, model);
  } else {
    // write new user to DB and ish
  }
});

module.exports = router;
