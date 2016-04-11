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
router.use('/auth/profile', require('./authenticated/profile'));

router.use('/auth/movie/my_rating', require('./authenticated/movies/my_movie_rating'));

router.use('/auth/movies/search', require('./authenticated/movies/find_movies'));
router.use('/auth/movies/recommended', require('./authenticated/movies/recommended_movies'));

router.use('/auth/actor/in_movie', require('./authenticated/actors/find_actors'));

router.use('/auth/director/directed_movie', require('./authenticated/directors/find_directors'));

module.exports = router;