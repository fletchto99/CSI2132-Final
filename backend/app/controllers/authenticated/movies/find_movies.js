var express = require('express');
var movies = require('../../../models/movie');
var router = express.Router();


router.post('/', function(request, response) {

    movies.fetchMovie(request.body).then(function(results) {
        response.json({
            movies: results
        });
    }, function(error) {
        response.jsonError(error, 500);
    });

});

module.exports = router;