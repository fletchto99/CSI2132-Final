var express = require('express');
var router = express.Router();

var user = require('../../models/user');

router.get('/', function (req, res) {
    user.fetchProfile({
        profile_id: req.session.user.profile_id
    }).then(function (result) {
        res.json({
            profile: result
        });
    }, function (error) {
        res.jsonError(error, 400);
    });
});

router.put('/', function (req, res) {
    req.body.profile_id = req.session.user.profile_id;//Yeah nice try, you can only modify your own profile
    user.updateProfile(req.body).then(function (result) {
        res.json({
            profile: req.body
        });
    }, function (error) {
        console.log(error);
        res.jsonError(error, 400);
    });
});


module.exports = router;