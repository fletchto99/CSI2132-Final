var express = require('express');
var movies = require('../../../models/movie');
var router = express.Router();


router.post('/', function(request, response) {
    request.body.profile_id = request.session.user.profile_id;
    movies.getMyRating(request.body).then(function(results) {
        response.json({
            rating: results
        });
    }, function(error) {
        response.jsonError(error, 500);
    });

});

router.put('/', function(request, response) {
    request.body.profile_id = request.session.user.profile_id;
    movies.updateMyRating(request.body).then(function() {
        response.json({
            success: true
        });
    }, function(error) {
        response.jsonError(error, 500);
    });

});

module.exports = router;