var express = require('express');
var user = require('../../models/user');
var security = require('../../helpers/security');
var config = require('../../../config/app.json');
var router = express.Router();

router.post('/', function (req, res) {
    if (req.session.user != null) {
        res.json(req.session.user);
    } else {
        user.authenticate({
            username: req.body.username,
            password: req.body.password
        }, function (error, result) {
            if (!error) {
                res.json(result);
            } else {
                res.status(401).json({
                    error: 'Invalid username or password'
                });
            }
        });
    }

});

module.exports = router;