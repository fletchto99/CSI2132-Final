var express = require('express');
var example = require('../models/example');
var router = express.Router();

router.get('/', function(request, response) {
    response.json({
        auth: 'Authenticated! ' + request.username
    })
});

module.exports = router;