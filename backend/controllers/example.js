var express = require('express');
var router = express.Router();
var example = require('../models/example');

router.get('/:id', function(request, response) {
    example.example({
        sailor_id: request.params.id
    }, function(error, result) {
        if (!error) {
            response.json(result);
        }
    });

});

module.exports = router;