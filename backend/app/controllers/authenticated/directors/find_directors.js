var express = require('express');
var director = require('../../../models/director');
var router = express.Router();


router.post('/', function(request, response) {

    director.fetchDirector(request.body).then(function(results) {
        response.json({
            directors: results
        });
    }, function(error) {
        response.jsonError(error, 500);
    });

});

module.exports = router;