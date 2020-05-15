const express = require('express');

const router = express.Router();

const debug = require('debug');

const log = debug('guess:routes');

const dateformat = require('dateformat');

const { ObjectID } = require('mongodb');

const url = require('url');

const { getDb } = require('../config/db');

const config = require('../config/config');

const { getPassport } = require('../config/passport');

const passport = getPassport();

const { routes, views, title } = config;

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
  log('We trying to login real quick dawg...');
  // haha could be more errors we can make with req.flash
  res.render(views.signup, { title, message: req.flash('error') });
});

/**
 * Post Signup Form
 */
router.post('/signup', function (req, res) {
  log('We trying to login real quick dawg...');
  res.render(views.login, { title, message: req.flash('error') });
});

module.exports = router;
