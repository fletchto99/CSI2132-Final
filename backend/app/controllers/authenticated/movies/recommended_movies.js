var express = require('express');
var movies = require('../../../models/movie');
var router = express.Router();


router.get('/', function(request, response) {

    movies.recommendMovies({
        profile_id: request.session.user.profile_id
    }).then(function(results) {
        response.json({
            movies: results
        });
    }, function(error) {
        response.jsonError(error, 500);
    });

});

module.exports = router;