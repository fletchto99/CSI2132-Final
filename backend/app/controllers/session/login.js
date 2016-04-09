var express = require('express');
var user = require('../../models/user');
var router = express.Router();

router.post('/', function (req, res) {
    if (req.session.user != null) {
        res.json(req.session.user);
    } else {
        user.authenticate(req.body).then(function (result) {
            req.session.user = result;
            res.json(req.session.user);
        }, function (error) {
            res.jsonError(error, 400);
        });
    }

});

module.exports = router;