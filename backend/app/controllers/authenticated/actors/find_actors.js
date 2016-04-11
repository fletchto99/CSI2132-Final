var express = require('express');
var actor = require('../../../models/actor');
var router = express.Router();


router.post('/', function(request, response) {

    actor.fetchActor(request.body).then(function(results) {
        response.json({
            actors: results
        });
    }, function(error) {
        response.jsonError(error, 500);
    });

});

module.exports = router;