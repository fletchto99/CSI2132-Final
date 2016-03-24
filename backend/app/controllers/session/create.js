var express = require('express');
var user = require('../../models/user');
var router = express.Router();

router.put('/', function (request, response) {
    user.create({
        username: req.body.username,
        password: req.body.password
    }, function (error, result) {
        if (!error) {
            request.session.user = result;
            response.json(result);
        } else {
            response.status(401).json({
                error: 'Invalid username or password'
            });
        }
    });

});

exports = router;