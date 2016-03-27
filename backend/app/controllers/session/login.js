var express = require('express');
var user = require('../../models/user');
var developer = require('../../helpers/developer');
var router = express.Router();

router.post('/', function (req, res) {
    if (req.session.user != null) {
        res.json(req.session.user);
    } else {
        user.authenticate(req.body).then(function (result) {
            req.session.user = result;
            res.json(req.session.user);
        }, function (error) {
            developer.prepareDevResponse(error);
            res.status(400).json(error);
        });
    }

});

module.exports = router;