var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var router = express.Router();

router.use(require('./proxy'));
router.use(bodyParser.json());
router.use(session(require('../../config/session.json')));
router.use('/auth', require('./auth'));
// router.use('/auth', require('./tokenizer')); //TODO: Figure out CSRF

module.exports = router;