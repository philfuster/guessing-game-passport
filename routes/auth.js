const express = require('express');

const router = express.Router();

const debug = require('debug');

const log = debug('guess:routes');

const dateformat = require('dateformat');

const { ObjectID } = require('mongodb');

const url = require('url');

const { getDb } = require('../config/db');

const config = require('../config/config');

const { routes, views, title } = config;

router.get('/', function (req, res) {
  res.render(views.login, { title });
});

module.exports = router;
