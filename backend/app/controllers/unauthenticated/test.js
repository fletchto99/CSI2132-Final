var express = require('express');
var example = require('../../models/example');
var router = express.Router();

router.get('/', function(request, response) {
    example.example(function(error, result) {
        if (!error) {
            response.json(result);
        }
    });

});

exports = router;