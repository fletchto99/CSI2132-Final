var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var helmet = require('helmet');
var FileStore = require('session-file-store')(session);
var router = express.Router();

var sessionObj = require('../../config/session.json');
sessionObj.store = new FileStore;

router.use(require('./error'));
router.use(bodyParser.json());
router.use(helmet());
router.use(session(sessionObj));
router.use('/auth', require('./auth'));


module.exports = router;