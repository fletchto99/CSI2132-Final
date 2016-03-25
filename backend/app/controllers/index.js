var express = require('express');
var router = express.Router();

/**
 * Session controllers
 */
router.use('/login', require('./session/login'));
router.use('/logout', require('./session/logout'));
router.use('/register', require('./session/register'));

/**
 * Open API endpoints
 */
router.use('/test', require('./unauthenticated/test'));

/**
 * Authenticated api endpoints
 */
router.use('/auth/whoami', require('./authenticated/whoami'));

module.exports = router;