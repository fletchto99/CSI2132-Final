var express = require('express');
var example = require('../models/example');
var router = express.Router();

router.get('/:id', function(request, response) {
    example.example({
        id: request.params.id
    }, function(error, result) {
        if (!error) {
            response.json(result);
        }
    });

});

module.exports = router;