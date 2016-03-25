var express = require('express');
var user = require('../../models/user');
var router = express.Router();

router.put('/', function (req, res) {
    if (req.session.user) {
        res.status(400).json({
            error: 'You must be logged out before creating a new user!'
        });
    } else {
        user.create(req.body).then(function (result) {
            req.session.user = result;
            res.json(req.session.user);
        }, function (error) {
            res.status(400).json(error);
        });
    }
});

module.exports = router;