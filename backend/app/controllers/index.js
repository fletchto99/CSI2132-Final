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

/**
 * Authenticated api endpoints
 */
router.use('/auth/whoami', require('./authenticated/whoami'));
router.use('/auth/find_movies', require('./authenticated/find_movies'));
router.use('/auth/movie/my_rating', require('./authenticated/my_movie_rating'));

module.exports = router;