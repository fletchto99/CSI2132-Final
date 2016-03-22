var express = require('express');
var user = require('../../models/user');
var router = express.Router();

router.post('/', function (request, response) {
    user.authenticate({
        username: req.body.username,
        password: req.body.password
    }, function (error, result) {
        if (!error) {
            response.json(result);
        } else {
            response.status(401).json({
               error: 'Invalid username or password'
            });
        }
    });

});

module.exports = router;